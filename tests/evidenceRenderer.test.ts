import { describe, it, expect } from 'vitest';
import {
  formatSourceKindBadge,
  formatCitationRoleBadge,
  formatClaimTypeBadge,
  formatEvidenceLevelBadge,
  renderClaimCardHtml
} from '../src/ui/renderers/evidenceRenderer';
import { ClaimRecord, SourceRecord } from '../src/types';

describe('Evidence & Citation UI Renderer Tests', () => {
  it('should render distinct badges for all SourceKind values', () => {
    expect(formatSourceKindBadge('primary-study')).toContain('kind-primary-study');
    expect(formatSourceKindBadge('systematic-review')).toContain('kind-systematic-review');
    expect(formatSourceKindBadge('official')).toContain('kind-official');
    expect(formatSourceKindBadge('theory')).toContain('kind-theory');
    expect(formatSourceKindBadge('patient-narrative')).toContain('kind-patient-narrative');
    expect(formatSourceKindBadge('position-paper')).toContain('kind-position-paper');
  });

  it('should render distinct badges for all CitationRole values', () => {
    expect(formatCitationRoleBadge('supports')).toContain('role-supports');
    expect(formatCitationRoleBadge('qualifies')).toContain('role-qualifies');
    expect(formatCitationRoleBadge('contradicts')).toContain('role-contradicts');
    expect(formatCitationRoleBadge('background')).toContain('role-background');
  });

  it('should prevent draft claims from rendering positive public evidence badges', () => {
    const draftClaim: ClaimRecord = {
      id: 'test_claim_draft',
      statement: 'Test statement',
      publicExplanation: 'Test explanation',
      type: 'effectiveness',
      citations: [],
      evidenceLevel: 'well-supported', // Even if well-supported, draft status must hide it
      reviewStatus: 'draft'
    };

    const renderedBadge = formatEvidenceLevelBadge(draftClaim);
    expect(renderedBadge).toContain('draft-badge-warning');
    expect(renderedBadge).toContain('Entwurf');
    expect(renderedBadge).not.toContain('Gut belegt');
  });

  it('should render public evidence badge when claim is approved', () => {
    const approvedClaim: ClaimRecord = {
      id: 'test_claim_approved',
      statement: 'Test statement',
      publicExplanation: 'Test explanation',
      type: 'effectiveness',
      citations: [],
      evidenceLevel: 'well-supported',
      reviewStatus: 'approved'
    };

    const renderedBadge = formatEvidenceLevelBadge(approvedClaim);
    expect(renderedBadge).toContain('level-well-supported');
    expect(renderedBadge).toContain('Gut belegt');
    expect(renderedBadge).not.toContain('draft-badge-warning');
  });

  it('should render complete claim card HTML including citation details', () => {
    const claim: ClaimRecord = {
      id: 'claim_test',
      statement: 'Therapeutische Allianz ist wirksam.',
      publicExplanation: 'Metaanalysen belegen den Zusammenhang.',
      type: 'association',
      citations: [{ sourceId: 'src_test', role: 'supports', locator: 'S. 42' }],
      evidenceLevel: 'well-supported',
      reviewStatus: 'approved'
    };

    const source: SourceRecord = {
      id: 'src_test',
      kind: 'systematic-review',
      title: 'Meta-Analysis of Alliance',
      authors: 'Horvath et al.',
      year: 2020
    };

    const html = renderClaimCardHtml(claim, [{ citation: claim.citations[0], source }]);
    expect(html).toContain('Horvath et al.');
    expect(html).toContain('Fundstelle: S. 42');
    expect(html).toContain('kind-systematic-review');
    expect(html).toContain('role-supports');
  });
});
