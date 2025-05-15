import {
	BaseInputParams,
	BindingTarget,
	CompositeConstraint,
	createPlugin,
	InputBindingPlugin,
	parseRecord,
} from '@tweakpane/core';

import { PluginController } from './controller.js';

export interface PluginInputParams extends BaseInputParams {
	view: 'item-list';
	options: string[];
	pickText?: string;
	emptyText?: string;
}

export const TweakpaneItemListPlugin: InputBindingPlugin<
	string[],
	string[],
	PluginInputParams
> = createPlugin({
	id: 'item-list',
	type: 'input',

	accept(exValue: unknown, params: Record<string, unknown>) {
		if (!Array.isArray(exValue)) {
			return null;
		}

		const result = parseRecord<PluginInputParams>(params, (p) => ({
			view: p.required.constant('item-list'),
			options: p.required.array(p.required.string),
			pickText: p.optional.string,
			emptyText: p.optional.string
		}));

		if (!result) {
			return null;
		}

		return {
			initialValue: exValue as string[],
			params: result,
		};
	},

	binding: {
		reader(_args) {
			return (exValue: unknown): string[] => {
				if (!Array.isArray(exValue)) {
					return [];
				}
				return (exValue as string[]).map((value) => {
					return _args.params.options.find((option) => option === value) ?? value;
				}).filter((item): item is string => item !== undefined);
			};
		},

		constraint(_args) {
			return new CompositeConstraint([]);
		},

		writer(_args) {
			return (target: BindingTarget, inValue: string[]) => {
				target.write(inValue);
			};
		},
	},

	controller(args) {
		return new PluginController(args.document, {
			value: args.value,
			valueOptions: args.params.options,
			viewProps: args.viewProps,
			pickText: args.params.pickText,
			emptyText: args.params.emptyText
		});
	},
});
