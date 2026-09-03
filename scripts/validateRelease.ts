import { validateKnowledgeGraph } from '../src/validation/validateKnowledge';

console.log('--- Psychotherapie-Landkarte: Release Gate Check ---');
const report = validateKnowledgeGraph();

console.log(`Gültig: ${report.isValid ? 'JA' : 'NEIN'}`);
console.log(`Gefundene Fehler: ${report.errorsCount}`);
console.log(`Gefundene Warnungen: ${report.warningsCount}`);
console.log(`Erreichbare Claims: ${report.reachableClaimIds.length}`);
console.log(`Erreichbare Draft-Claims: ${report.reachableDraftClaimIds.length} (${report.reachableDraftClaimIds.join(', ')})`);
console.log(`Release-Status: ${report.releaseStatus}`);

if (!report.isValid) {
  console.error('\n❌ [RELEASE GATE FAILED] Strukturelle Validierungsfehler im Wissensgraphen:');
  for (const issue of report.issues.filter(i => i.level === 'ERROR')) {
    console.error(`  - [${issue.category}] ${issue.entityId}: ${issue.message}`);
  }
  process.exit(1);
}

if (report.releaseStatus === 'BLOCKED_BY_DRAFT_CONTENT') {
  console.error('\n⛔ [RELEASE GATE FAILED] Erreichbare Entwürfe gefunden:');
  console.error(`Es befinden sich ${report.reachableDraftClaimIds.length} erreichbare Claims im Status 'draft'.`);
  console.error('Ein Produktions-Release ist erst nach vollständiger Zitat- und Quellenprüfung (Status: approved/source-checked) zulässig.');
  process.exit(1);
}

console.log('\n✅ [RELEASE GATE PASSED] Wissensgraph vollständig validiert und freigabebereit.');
process.exit(0);
