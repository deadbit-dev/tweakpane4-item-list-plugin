import type { TpPlugin } from 'tweakpane';

import { TweakpaneItemListPlugin } from './plugin.js';

export const id = 'item-list';

export const css = '__css__';

export const plugins: TpPlugin[] = [TweakpaneItemListPlugin];
