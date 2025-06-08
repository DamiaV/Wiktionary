export default class PageQualityInputWidget extends OO.ui.RadioSelectInputWidget {
  /**
   * @param config Configuration options.
   */
  constructor(config: OO.ui.RadioSelectInputWidget.ConfigOptions);

  /**
   * @inheritdoc
   */
  setDisabled(disabled: boolean): this;

  /**
   * Update the prefix in the edit-summary input field when the quality is changed.
   */
  updateSummaryPrefix(): void;
}
