import { QtiMatch } from './qti-match';
import { html, render } from 'lit';
import { QtiAssessmentItem } from '../../../qti-assessment-item/qti-assessment-item';
import { ResponseVariable } from '../../../internal/variables';
import { describe, expect, it } from '@jest/globals';
import '../../../index';

describe('qti-match', () => {
  it('should check if the variable identified in the first child is contained in the second one', () => {
    const template = () => html`
      <qti-assessment-item>
        <qti-response-declaration identifier="TEI1" base-type="string" cardinality="single">
          <qti-correct-response>
            <qti-value>test</qti-value>
          </qti-correct-response>
        </qti-response-declaration>
        <qti-match>
          <qti-variable identifier="TEI1"></qti-variable>
          <qti-correct identifier="TEI1"></qti-correct>
        </qti-match>
      </qti-assessment-item>
    `;
    render(template(), document.body);

    const qtiMatch = document.body.querySelector('qti-match') as QtiMatch;
    const assessmentItem = document.body.querySelector('qti-assessment-item') as QtiAssessmentItem;
    assessmentItem.updateResponseVariable('TEI1', 'test');
    expect(qtiMatch.calculate()).toBeTruthy();
  });
});
