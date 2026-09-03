import { ClaimRecord, SourceRecord, CitationRole, SourceKind, ClaimType } from '../../types';

export function formatSourceKindBadge(kind: SourceKind): string {
  switch (kind) {
    case 'primary-study':
      return `<span class="source-kind-badge kind-primary-study">🔬 Primärstudie</span>`;
    case 'systematic-review':
      return `<span class="source-kind-badge kind-systematic-review">📑 Systematisches Review</span>`;
    case 'official':
      return `<span class="source-kind-badge kind-official">🏛️ Offizielle Regelung</span>`;
    case 'theory':
      return `<span class="source-kind-badge kind-theory">💡 Theoretisches Modell</span>`;
    case 'patient-narrative':
      return `<span class="source-kind-badge kind-patient-narrative">🗣️ Patientenerfahrung</span>`;
    case 'position-paper':
      return `<span class="source-kind-badge kind-position-paper">📄 Positionspapier</span>`;
    default:
      return `<span class="source-kind-badge">${kind}</span>`;
  }
}

export function formatCitationRoleBadge(role: CitationRole): string {
  switch (role) {
    case 'supports':
      return `<span class="citation-role-badge role-supports">🟢 Stützt Befund</span>`;
    case 'qualifies':
      return `<span class="citation-role-badge role-qualifies">🟡 Schränkt ein / Qualifiziert</span>`;
    case 'contradicts':
      return `<span class="citation-role-badge role-contradicts">🔴 Widerspricht Befund</span>`;
    case 'background':
      return `<span class="citation-role-badge role-background">🔵 Kontext / Hintergrund</span>`;
    default:
      return `<span class="citation-role-badge">${role}</span>`;
  }
}

export function formatClaimTypeBadge(type: ClaimType): string {
  switch (type) {
    case 'effectiveness': return '🔬 Wirksamkeitsbefund';
    case 'association': return '📊 Zusammenhang / Prädiktor';
    case 'process': return '⚙️ Wirkmechanismus';
    case 'definition': return '📖 Begriffsklärung';
    case 'care-fact': return '🏛️ Versorgungsregel';
    case 'theory': return '💡 Theoretisches Fachmodell';
    case 'experience': return '🗣️ Patientenerfahrung (Kein Wirkbeleg)';
    default: return type;
  }
}

export function formatEvidenceLevelBadge(claim: ClaimRecord): string {
  if (claim.reviewStatus === 'draft') {
    return `<span class="draft-badge-warning">[Entwurf: Zitatprüfung ausstehend]</span>`;
  }

  switch (claim.evidenceLevel) {
    case 'well-supported':
      return `<span class="evidence-level-badge level-well-supported">Gut belegt (Studien/Reviews)</span>`;
    case 'limited':
      return `<span class="evidence-level-badge level-limited">Vorläufige Evidenz</span>`;
    case 'mixed':
      return `<span class="evidence-level-badge level-mixed">Widersprüchliche Befunde</span>`;
    case 'not-established':
      return `<span class="evidence-level-badge level-not-established">Hypothetisch / Nicht nachgewiesen</span>`;
    case 'not-applicable':
      return `<span class="evidence-level-badge level-not-applicable">Informationswissen</span>`;
    default:
      return `<span class="evidence-level-badge">${claim.evidenceLevel}</span>`;
  }
}

export function renderClaimCardHtml(claim: ClaimRecord, citationsWithSources: { citation: import('../../types').ClaimCitation; source: SourceRecord }[]): string {
  return `
    <div class="claim-card" data-claim-id="${claim.id}">
      <div class="claim-header">
        <span class="claim-type-badge type-${claim.type}">${formatClaimTypeBadge(claim.type)}</span>
        ${formatEvidenceLevelBadge(claim)}
      </div>
      <div class="claim-statement">${claim.statement}</div>
      <div class="claim-explanation">${claim.publicExplanation}</div>
      ${claim.limitations ? `<div class="claim-limitations">⚠️ <em>Einschränkung:</em> ${claim.limitations}</div>` : ''}
      
      <div class="citations-list">
        <div class="citations-title">Nachweise & Fundstellen:</div>
        <ul>
          ${citationsWithSources.map(c => `
            <li class="citation-item">
              <div class="citation-badges">
                ${formatSourceKindBadge(c.source.kind)}
                ${formatCitationRoleBadge(c.citation.role)}
              </div>
              <div class="citation-body">
                <strong>${c.source.authors ? `${c.source.authors} (${c.source.year || 'o.J.'}): ` : ''}</strong>
                <em>${c.source.title}</em>
                ${c.source.venue ? ` • ${c.source.venue}` : ''}
                ${c.citation.locator ? ` <span class="citation-locator">[Fundstelle: ${c.citation.locator}]</span>` : ''}
                ${c.citation.note ? ` <span class="citation-note">(${c.citation.note})</span>` : ''}
                ${c.source.url ? ` <a href="${c.source.url}" target="_blank" rel="noopener noreferrer" class="citation-link">↗ Offizielle Quelle</a>` : ''}
                ${c.source.doi ? ` <a href="https://doi.org/${c.source.doi}" target="_blank" rel="noopener noreferrer" class="citation-link">↗ DOI</a>` : ''}
              </div>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
}
