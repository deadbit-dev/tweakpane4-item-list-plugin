import { Value, View, ViewProps } from '@tweakpane/core';

interface Config {
	value: Value<string[]>;
	valueOptions: string[];
	viewProps: ViewProps;
	onRemoveItem: (itemValue: string) => void;
	onAddItem: (itemValue: string) => void;
	pickText?: string;
	emptyText?: string;
}

export class PluginView implements View {
	public readonly element: HTMLElement;
	private value_: Value<string[]>;
	private valueOptions_: string[];
	private viewProps_: ViewProps;
	private onRemoveItem_: (itemValue: string) => void;
	private onAddItem_: (itemValue: string) => void;
	private listBlock_: HTMLElement;
	private optionsList_: HTMLUListElement;
	private optionsWrap_: HTMLElement;
	private triggerBtn_: HTMLButtonElement;
	private emptyText_: string;

	constructor(doc: Document, config: Config) {
		this.value_ = config.value;
		this.valueOptions_ = config.valueOptions;
		this.viewProps_ = config.viewProps;
		this.onRemoveItem_ = config.onRemoveItem;
		this.onAddItem_ = config.onAddItem;
		this.emptyText_ = config.emptyText || 'Нет элементов';

		this.element = doc.createElement('div');
		this.element.classList.add('tp-itemlistv');

		// Options list
		this.optionsList_ = doc.createElement('ul');
		this.optionsList_.classList.add('tp-itemlistv_options');

		// Add options
		this.valueOptions_.forEach(opt => {
			const li = doc.createElement('li');
			li.classList.add('tp-itemlistv_option');

			// Add checkmark span
			const checkmark = doc.createElement('span');
			checkmark.classList.add('tp-itemlistv_checkmark');
			checkmark.textContent = '✓';
			li.appendChild(checkmark);

			// Add text span
			const text = doc.createElement('span');
			text.classList.add('tp-itemlistv_option-text');
			text.textContent = opt;
			li.appendChild(text);

			li.onclick = () => {
				this.onAddItem_(opt);
				this.hideOptions();
			};
			this.optionsList_.appendChild(li);
		});

		// Trigger button
		this.triggerBtn_ = doc.createElement('button');
		this.triggerBtn_.classList.add('tp-itemlistv_trigger');
		this.triggerBtn_.textContent = config.pickText || 'Выберите элемент';
		this.triggerBtn_.onclick = () => this.toggleOptions();

		this.optionsWrap_ = doc.createElement('div');
		this.optionsWrap_.classList.add('tp-itemlistv_options-wrap');
		this.optionsWrap_.appendChild(this.triggerBtn_);
		this.optionsWrap_.appendChild(this.optionsList_);
		this.element.appendChild(this.optionsWrap_);

		// Close options when clicking outside
		doc.addEventListener('click', (e) => {
			if (!this.optionsWrap_.contains(e.target as Node)) {
				this.hideOptions();
			}
		});

		// List block
		this.listBlock_ = doc.createElement('div');
		this.listBlock_.classList.add('tp-itemlistv_list');
		this.element.appendChild(this.listBlock_);

		// Drag&Drop highlight
		this.element.addEventListener('dragover', (e) => {
			e.preventDefault();
			this.listBlock_.classList.add('tp-itemlistv_list--dragover');
		});
		this.element.addEventListener('dragleave', (e) => {
			e.preventDefault();
			// Only remove the class if we're leaving the list block itself
			if (!this.listBlock_.contains(e.relatedTarget as Node)) {
				this.listBlock_.classList.remove('tp-itemlistv_list--dragover');
			}
		});
		this.element.addEventListener('drop', (e) => {
			e.preventDefault();
			this.listBlock_.classList.remove('tp-itemlistv_list--dragover');
		});

		this.value_.emitter.on('change', this.renderList.bind(this));
		this.renderList();
		this.viewProps_.bindClassModifiers(this.element);
	}

	private toggleOptions() {
		this.optionsList_.classList.toggle('tp-itemlistv_options--active');
	}

	private hideOptions() {
		this.optionsList_.classList.remove('tp-itemlistv_options--active');
	}

	private renderList() {
		this.listBlock_.innerHTML = '';
		const items = this.value_.rawValue;

		// Update checkmarks in options list
		this.optionsList_.querySelectorAll('.tp-itemlistv_option').forEach(option => {
			const text = option.querySelector('.tp-itemlistv_option-text')?.textContent;
			if (text && items.includes(text)) {
				option.classList.add('tp-itemlistv_option--selected');
			} else {
				option.classList.remove('tp-itemlistv_option--selected');
			}
		});

		if (!items.length) {
			const empty = document.createElement('div');
			empty.classList.add('tp-itemlistv_empty');
			empty.textContent = this.emptyText_;
			this.listBlock_.appendChild(empty);
			return;
		}
		for (const item of items) {
			const rowWrap = document.createElement('div');
			rowWrap.classList.add('tp-itemlistv_row-wrap');

			const row = document.createElement('div');
			row.classList.add('tp-itemlistv_row');

			const valueDiv = document.createElement('div');
			valueDiv.classList.add('tp-itemlistv_value');
			valueDiv.textContent = item;
			row.appendChild(valueDiv);

			const removeBtn = document.createElement('button');
			removeBtn.classList.add('tp-itemlistv_remove-btn');
			removeBtn.textContent = '✕';
			removeBtn.onclick = () => this.onRemoveItem_(item);

			rowWrap.appendChild(row);
			rowWrap.appendChild(removeBtn);
			this.listBlock_.appendChild(rowWrap);
		}
	}

	public changeDraggingState(state: boolean) {
		if (state) this.listBlock_.classList.add('tp-itemlistv_list--dragover');
		else this.listBlock_.classList.remove('tp-itemlistv_list--dragover');
	}
}
