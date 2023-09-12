import { property } from 'lit/decorators.js';
import { ScoringHelper } from '../../utilities/scoring-helper';
import { QtiExpression } from '../qti-expression';
import { ResponseVariable } from '../../../qti-utilities/Variables';

export class QtiStringMatch extends QtiExpression<boolean> {
  @property({ type: String, attribute: 'case-sensitive' }) caseSensitive = 'true';

  public override calculate() {
    if (this.children.length === 2) {
      const values = this.getVariables() as ResponseVariable[];
      const value1 = values[0];
      const value2 = values[1];
      if (
        value1.cardinality !== 'single' ||
        value2.cardinality !== 'single' ||
        Array.isArray(value1.value) ||
        Array.isArray(value2.value)
      ) {
        console.error('unexpected cardinality in qti string-match');
        return false;
      }
      const v1 = this.caseSensitive === 'true' ? value1.value : value1.value.toLowerCase();
      const v2 = this.caseSensitive === 'true' ? value2.value : value2.value.toLowerCase();
      return ScoringHelper.compareSingleValues(v1, v2, value1.baseType);
    }
    console.error('unexpected number of children in qti-string-match');
    return null;
  }
}

customElements.define('qti-string-match', QtiStringMatch);
