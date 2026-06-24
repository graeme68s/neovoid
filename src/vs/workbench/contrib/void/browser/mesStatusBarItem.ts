/*--------------------------------------------------------------------------------------
 *  NeoVoid - Model Efficiency Scaling Status Bar Item
 *--------------------------------------------------------------------------------------*/

import { Disposable } from '../../../../base/common/lifecycle.js';
import { IStatusbarService, StatusbarAlignment } from '../../../services/statusbar/browser/statusbar.js';
import { IVoidSettingsService } from '../common/voidSettingsService.js';
import { IWorkbenchContribution } from '../../../common/contributions.js';
import { registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';
export const MES_TIER_FLASH = 'flash';
export const MES_TIER_PRO = 'pro';
export type MESTier = 'flash' | 'pro' | 'off' | 'idle';

// module-level so sendLLMMessage.ts can update it
let _currentTier: MESTier = 'idle';
let _updateBadge: (() => void) | null = null;

export const setMESTier = (tier: MESTier) => {
	_currentTier = tier;
	_updateBadge?.();
}

export class MESStatusBarItem extends Disposable implements IWorkbenchContribution {
	static readonly ID = 'workbench.contrib.mesStatusBarItem';

	private readonly _statusBarItem;

	constructor(
		@IStatusbarService private readonly _statusbarService: IStatusbarService,
		@IVoidSettingsService private readonly _settingsService: IVoidSettingsService,
	) {
		super();

		this._statusBarItem = this._statusbarService.addEntry(
			this._getEntry(),
			'mes.statusBarItem',
			StatusbarAlignment.RIGHT,
			100
		);

		_updateBadge = () => this._update();

		// update when settings change
		this._register(this._settingsService.onDidChangeState(() => this._update()));
	}

	private _getLabel(): string {
		const mesEnabled = this._settingsService.state.globalSettings.modelEfficiencyScaling ?? true;
		if (!mesEnabled) return '$(circle-slash) MES';
		if (_currentTier === 'flash') return '$(zap) MES';
		if (_currentTier === 'pro') return '$(circuit-board) MES';
		return '$(circle-outline) MES';
	}

	private _getTooltip(): string {
		const mesEnabled = this._settingsService.state.globalSettings.modelEfficiencyScaling ?? true;
		if (!mesEnabled) return 'Model Efficiency Scaling: OFF';
		if (_currentTier === 'flash') return 'Model Efficiency Scaling: Flash (simple query)';
		if (_currentTier === 'pro') return 'Model Efficiency Scaling: Pro (complex query)';
		return 'Model Efficiency Scaling: ON';
	}

	private _getEntry() {
		return {
			name: 'Model Efficiency Scaling',
			text: this._getLabel(),
			tooltip: this._getTooltip(),
			ariaLabel: 'Model Efficiency Scaling',
		}
	}

	private _update() {
		this._statusBarItem.update(this._getEntry());
	}
}

registerWorkbenchContribution2(MESStatusBarItem.ID, MESStatusBarItem, WorkbenchPhase.BlockRestore);
