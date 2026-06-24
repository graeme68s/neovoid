/*--------------------------------------------------------------------------------------
 *  Copyright 2025 Glass Devtools, Inc. All rights reserved.
 *  Licensed under the Apache License, Version 2.0. See LICENSE.txt for more information.
 *--------------------------------------------------------------------------------------*/

import { SendLLMMessageParams, OnText, OnFinalMessage, OnError } from '../../common/sendLLMMessageTypes.js';
import { IMetricsService } from '../../common/metricsService.js';
import { displayInfoOfProviderName } from '../../common/voidSettingsTypes.js';
import { sendLLMMessageToProviderImplementation } from './sendLLMMessage.impl.js';
// MES module-level state

const mesFlashModelOfProvider: Partial<Record<string, string>> = {
	anthropic: 'claude-haiku-4-5',
	deepseek: 'deepseek-v4-flash',
	openAI: 'gpt-4.1-nano',
	gemini: 'gemini-2.0-flash-lite',
	groq: 'llama-3.1-8b-instant',
}
const mesProModelOfProvider: Partial<Record<string, string>> = {
	anthropic: 'claude-sonnet-4-6',
	deepseek: 'deepseek-v4-pro',
	openAI: 'gpt-4.1',
	gemini: 'gemini-2.5-pro-preview-05-06',
	groq: 'llama-3.3-70b-versatile',
}

const mesRouteModel = async (
	providerName: string,
	modelName: string,
	messages: any[],
	settingsOfProvider: any,
	mesEnabled: boolean,
): Promise<string> => {
	if (!mesEnabled) return modelName

	const flashModel = mesFlashModelOfProvider[providerName]
	const proModel = mesProModelOfProvider[providerName]
	if (!flashModel || !proModel) return modelName

	const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user')
	if (!lastUserMsg) return flashModel

	const userText = typeof lastUserMsg.content === 'string'
		? lastUserMsg.content
		: lastUserMsg.content?.find?.((c: any) => c.type === 'text')?.text ?? ''

	try {
		let classification = 'SIMPLE'
		const impl = (sendLLMMessageToProviderImplementation as any)[providerName]
		if (!impl) return flashModel

		await impl.sendChat({
			messages: [{ role: 'user', content: `Reply with ONE word only — SIMPLE or COMPLEX.\nSIMPLE = quick question, lookup, small edit\nCOMPLEX = reasoning, debugging, architecture, analysis\n\nQuery: ${userText.slice(0, 400)}` }],
			separateSystemMessage: undefined,
			chatMode: null,
			mcpTools: undefined,
			modelName: flashModel,
			providerName,
			settingsOfProvider,
			modelSelectionOptions: undefined,
			overridesOfModel: undefined,
			_setAborter: () => { },
			onText: ({ fullText }: { fullText: string }) => { classification = fullText },
			onFinalMessage: ({ fullText }: { fullText: string }) => { classification = fullText },
			onError: () => { classification = 'SIMPLE' },
		})

		return classification.toUpperCase().includes('COMPLEX') ? proModel : flashModel
	} catch {
		return flashModel
	}
}

export const sendLLMMessage = async ({
	messagesType,
	messages: messages_,
	onText: onText_,
	onFinalMessage: onFinalMessage_,
	onError: onError_,
	abortRef: abortRef_,
	logging: { loggingName, loggingExtras },
	settingsOfProvider,
	modelSelection,
	modelSelectionOptions,
	overridesOfModel,
	chatMode,
	separateSystemMessage,
	mcpTools,
	globalSettings,
}: SendLLMMessageParams,

	metricsService: IMetricsService
) => {


	const { providerName, modelName } = modelSelection

	// only captures number of messages and message "shape", no actual code, instructions, prompts, etc
	const captureLLMEvent = (eventId: string, extras?: object) => {


		metricsService.capture(eventId, {
			providerName,
			modelName,
			customEndpointURL: settingsOfProvider[providerName]?.endpoint,
			numModelsAtEndpoint: settingsOfProvider[providerName]?.models?.length,
			...messagesType === 'chatMessages' ? {
				numMessages: messages_?.length,
			} : messagesType === 'FIMMessage' ? {
				prefixLength: messages_.prefix.length,
				suffixLength: messages_.suffix.length,
			} : {},
			...loggingExtras,
			...extras,
		})
	}
	const submit_time = new Date()

	let _fullTextSoFar = ''
	let _aborter: (() => void) | null = null
	let _setAborter = (fn: () => void) => { _aborter = fn }
	let _didAbort = false

	const onText: OnText = (params) => {
		const { fullText } = params
		if (_didAbort) return
		onText_(params)
		_fullTextSoFar = fullText
	}

	const onFinalMessage: OnFinalMessage = (params) => {
		const { fullText, fullReasoning, toolCall } = params
		if (_didAbort) return
		captureLLMEvent(`${loggingName} - Received Full Message`, { messageLength: fullText.length, reasoningLength: fullReasoning?.length, duration: new Date().getMilliseconds() - submit_time.getMilliseconds(), toolCallName: toolCall?.name })
		onFinalMessage_(params)
	}

	const onError: OnError = ({ message: errorMessage, fullError }) => {
		if (_didAbort) return
		console.error('sendLLMMessage onError:', errorMessage)

		// handle failed to fetch errors, which give 0 information by design
		if (errorMessage === 'TypeError: fetch failed')
			errorMessage = `Failed to fetch from ${displayInfoOfProviderName(providerName).title}. This likely means you specified the wrong endpoint in Void's Settings, or your local model provider like Ollama is powered off.`

		captureLLMEvent(`${loggingName} - Error`, { error: errorMessage })
		onError_({ message: errorMessage, fullError })
	}

	// we should NEVER call onAbort internally, only from the outside
	const onAbort = () => {
		captureLLMEvent(`${loggingName} - Abort`, { messageLengthSoFar: _fullTextSoFar.length })
		try { _aborter?.() } // aborter sometimes automatically throws an error
		catch (e) { }
		_didAbort = true
	}
	abortRef_.current = onAbort


	if (messagesType === 'chatMessages')
		captureLLMEvent(`${loggingName} - Sending Message`, {})
	else if (messagesType === 'FIMMessage')
		captureLLMEvent(`${loggingName} - Sending FIM`, { prefixLen: messages_?.prefix?.length, suffixLen: messages_?.suffix?.length })


	try {
		const implementation = sendLLMMessageToProviderImplementation[providerName]
		if (!implementation) {
			onError({ message: `Error: Provider "${providerName}" not recognized.`, fullError: null })
			return
		}
		const { sendFIM, sendChat } = implementation
		if (messagesType === 'chatMessages') {
			const routedModel = messagesType === 'chatMessages' ? await mesRouteModel(providerName, modelName, messages_, settingsOfProvider, globalSettings?.modelEfficiencyScaling ?? true) : modelName
			await sendChat({ messages: messages_, onText, onFinalMessage, onError, settingsOfProvider, modelSelectionOptions, overridesOfModel, modelName: routedModel, _setAborter, providerName, separateSystemMessage, chatMode, mcpTools })
			return
		}
		if (messagesType === 'FIMMessage') {
			if (sendFIM) {
				await sendFIM({ messages: messages_, onText, onFinalMessage, onError, settingsOfProvider, modelSelectionOptions, overridesOfModel, modelName, _setAborter, providerName, separateSystemMessage })
				return
			}
			onError({ message: `Error running Autocomplete with ${providerName} - ${modelName}.`, fullError: null })
			return
		}
		onError({ message: `Error: Message type "${messagesType}" not recognized.`, fullError: null })
		return
	}

	catch (error) {
		if (error instanceof Error) { onError({ message: error + '', fullError: error }) }
		else { onError({ message: `Unexpected Error in sendLLMMessage: ${error}`, fullError: error }); }
		// ; (_aborter as any)?.()
		// _didAbort = true
	}



}

