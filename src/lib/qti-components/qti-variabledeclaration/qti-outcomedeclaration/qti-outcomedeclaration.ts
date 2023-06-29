import { property } from 'lit/decorators.js';
import { BaseType, Cardinality } from '../../qti-utilities/ExpressionResult';
import { OutcomeVariable } from '../../qti-utilities/OutcomeVariable';
import { QtiVariableDeclaration } from '../qti-variabledeclaration';

export class QtiOutcomeDeclaration extends QtiVariableDeclaration {
  @property({ type: String, attribute: 'base-type' }) baseType: BaseType;

  @property({ type: String }) identifier: string;

  @property({ type: String }) cardinality: Cardinality;

  get interpolationTable() {
    const table = this.querySelector('qti-interpolation-table');
    if (table) {
      const entries = new Map<number, number>();
      for (const entry of table.querySelectorAll('qti-interpolation-table-entry')) {
        if (!entry.getAttribute('source-value') && entry.getAttribute('target-value')) {
          console.error('source-value or target-value is missing in qti-interpolation-table-entry');
        }
        const sourceValue = parseInt(entry.getAttribute('source-value'));
        const targetValue = parseInt(entry.getAttribute('target-value'));
        if (isNaN(sourceValue) || isNaN(targetValue)) {
          console.error('source-value or target-value is not a number in qti-interpolation-table-entry');
        }
        entries.set(sourceValue, targetValue);
      }
    }
    return null;
  }

  public override connectedCallback() {
    super.connectedCallback();

    const outcomeVariable = new OutcomeVariable();
    outcomeVariable.identifier = this.identifier;
    outcomeVariable.cardinality = this.cardinality;
    outcomeVariable.baseType = this.baseType;

    // outcome variables can have a default value
    const outcomeVariables = Array.from(this.querySelectorAll('qti-default-value > qti-value')).map(n => n.innerHTML);
    if (outcomeVariables.length > 1) {
      outcomeVariable.value = outcomeVariables;
    }
    if (outcomeVariables.length === 1) {
      outcomeVariable.value = outcomeVariables[0];
    }
    if (!outcomeVariables) {
      outcomeVariable.value = null;
    }

    this.dispatchEvent(
      new CustomEvent('qti-register-variable', {
        bubbles: true,
        composed: true,
        detail: { variable: outcomeVariable }
      })
    );

    // const qtiAssessmentItem = this.closest("qti-assessment-item") as QtiAssessmentItem
    // qtiAssessmentItem.variables.push(outcomeVariable);
  }
}

customElements.define('qti-outcome-declaration', QtiOutcomeDeclaration);
