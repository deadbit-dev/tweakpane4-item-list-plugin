import { Controller, Value, ViewProps } from '@tweakpane/core';
import { PluginView } from './view.js';

interface Config {
	value: Value<string[]>;
	valueOptions: string[];
	viewProps: ViewProps;
	pickText?: string;
	emptyText?: string;
}

export class PluginController implements Controller<PluginView> {
	public readonly value: Value<string[]>;
	public readonly valueOptions: string[];
	public readonly view: PluginView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: Config) {
		this.value = config.value;
		this.valueOptions = config.valueOptions;
		this.viewProps = config.viewProps;

		this.view = new PluginView(doc, {
			value: this.value,
			valueOptions: config.valueOptions,
			viewProps: this.viewProps,
			onRemoveItem: this.onRemoveItem.bind(this),
			onAddItem: this.onAddItem.bind(this),
			pickText: config.pickText,
			emptyText: config.emptyText
		});

		this.onDrop = this.onDrop.bind(this);
		this.onDragOver = this.onDragOver.bind(this);
		this.onDragLeave = this.onDragLeave.bind(this);

		this.view.element.addEventListener('drop', this.onDrop);
		this.view.element.addEventListener('dragover', this.onDragOver);
		this.view.element.addEventListener('dragleave', this.onDragLeave);

		this.viewProps.handleDispose(() => {
			this.view.element.removeEventListener('drop', this.onDrop);
			this.view.element.removeEventListener('dragover', this.onDragOver);
			this.view.element.removeEventListener('dragleave', this.onDragLeave);
		});
	}

	private onRemoveItem(itemValue: string) {
		this.value.setRawValue(this.value.rawValue.filter(item => item !== itemValue));
	}

	private onAddItem(itemValue: string) {
		if (!this.value.rawValue.some(item => item === itemValue)) {
			this.value.setRawValue([...this.value.rawValue, itemValue]);
		}
	}

	private onDrop(event: DragEvent) {
		event.preventDefault();
		this.view.changeDraggingState(false);

		const droppedValue = event.dataTransfer?.getData('text/plain');
		if (droppedValue && this.valueOptions.some(opt => opt === droppedValue)) {
			this.onAddItem(droppedValue);
		}
	}

	private onDragOver(event: DragEvent) {
		event.preventDefault();
		this.view.changeDraggingState(true);
	}

	private onDragLeave() {
		this.view.changeDraggingState(false);
	}
}
