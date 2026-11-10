# Graph Report - OPS-elimination-tool  (2026-10-27)

## Corpus Check
- Corpus is ~20,018 words - fits in a single context window. You may not need a graph.

## Summary
- 182 nodes · 359 edges · 8 communities (7 shown, 1 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.87)
- Token cost: 91,952 input · 0 output

## Community Hubs (Navigation)
- OPS Rules and Notation
- App State and Handlers
- Build and Deploy Setup
- Type Code Parser and Molecule
- Reading Tab Rendering
- Reading Tab Design Spec
- Card Content and Sources
- Agent Instructions

## God Nodes (most connected - your core abstractions)
1. `App()` - 25 edges
2. `ReadingTab()` - 11 edges
3. `typeCode.js strict parser/validator` - 10 edges
4. `TotemCurve()` - 9 edges
5. `readPaste()` - 9 edges
6. `selectionsFromCell()` - 9 edges
7. `Molecule()` - 7 edges
8. `validate()` - 7 edges
9. `OPS Elimination Tool README` - 7 edges
10. `Elimination Tool (9 coin toggle rows)` - 7 edges

## Surprising Connections (you probably didn't know these)
- `frontend/index.html entry page` --conceptually_related_to--> `Vite base /OPS-elimination-tool/`  [INFERRED]
  frontend/index.html → contexto.md
- `checklistData.js checklist content (5 sections)` --shares_data_with--> `Checklist / Traits / Interpretation / Emoji tabs`  [EXTRACTED]
  contexto.md → README.md
- `INFO/ENERGY from last animal` --semantically_similar_to--> `OPS I/E from last animal rule`  [INFERRED] [semantically similar]
  como-se-lee.md → contexto.md
- `COIN_READINGS / TYPE_READINGS data format` --semantically_similar_to--> `checklistData.js checklist content (5 sections)`  [INFERRED] [semantically similar]
  como-se-lee.md → contexto.md
- `App()` --calls--> `ReadingTab()`  [EXTRACTED]
  frontend/src/App.jsx → frontend/src/ReadingTab.jsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Strict type-code parse/validate pipeline** — como_se_lee_short_code_regex, como_se_lee_long_code_regex, como_se_lee_validate_rules, contexto_typecode_module, contexto_read_paste_dispatch, readme_paste_box [EXTRACTED 1.00]
- **Coins derived from the last animal** — contexto_ops_ie_last_animal_rule, como_se_lee_info_energy_last_animal, como_se_lee_double_activated_animal, contexto_four_animal_ranking [INFERRED 0.85]
- **Reading tab building blocks** — readme_reading_tab, contexto_molecule_component, contexto_totemcurve_component, contexto_readingdata_module, como_se_lee_incomplete_type_states [EXTRACTED 1.00]

## Communities (8 total, 1 thin omitted)

### Community 0 - "OPS Rules and Notation"
Cohesion: 0.08
Nodes (34): como-se-lee.md Reading tab plan/spec, Animal formulas (Sleep=Oi+Di, Play=Oe+De, Consume=Oe+Di, Blast=Oi+De), Doubly activated animal = opposite of last, First animal formed by the two Saviors, INFO/ENERGY from last animal, LONG_CODE regex, Long form (11 coins), SHORT_CODE regex (+26 more)

### Community 1 - "App State and Handlers"
Cohesion: 0.11
Nodes (31): App(), applyBinaryString(), handleBinaryChange(), handleGridCellClick(), handleLegendClick(), handlePasteCode(), isFaded(), legendActive() (+23 more)

### Community 2 - "Build and Deploy Setup"
Cohesion: 0.08
Nodes (28): Port 5173 conflict with troppo Docker stack, frontend/index.html entry page, #root mount + /src/main.jsx module script, dependencies, react@^18.3.1, react-dom@^18.3.1, devDependencies, gh-pages@^6.3.0 (+20 more)

### Community 3 - "Type Code Parser and Molecule"
Cohesion: 0.12
Nodes (25): Axis(), FN_CLASS, Molecule(), Node(), POSITIONS, radiusOf(), ROLE_LABELS, ANIMAL_NAMES (+17 more)

### Community 4 - "Reading Tab Rendering"
Cohesion: 0.20
Nodes (19): COIN_READINGS, MAIN_COIN_COUNT, PENDING, CardHead(), coinStates(), faceOf(), MissingModalityCard(), ReadingTab() (+11 more)

### Community 5 - "Reading Tab Design Spec"
Cohesion: 0.24
Nodes (8): Incomplete type states (marked/deduced/undecided/missing), Function-stack molecule diagram spec, Opposite axes 90/10 (poles) and 60/40 (middle), -7..+7 extraversion scale (TOTEMS score), Reading tab work order (steps 1-6), Molecule.jsx function-stack SVG, TotemCurve.jsx normal curve, Reading tab

### Community 6 - "Card Content and Sources"
Cohesion: 0.38
Nodes (7): CognitiveNotes project (reading content author), Coin card content structure (250-450 words), COIN_READINGS / TYPE_READINGS data format, checklistData.js checklist content (5 sections), PDF "OPS traducido", readingData.js coin readings (PENDING texts), Synthesized checklist content (SF/NT/ST/NF, SC/CP/PB/BS)

## Knowledge Gaps
- **8 isolated node(s):** `CLAUDE.md project instructions`, `Reset button`, `Legacy FastAPI backend (fractal generator)`, `Port 5173 conflict with troppo Docker stack`, `Synthesized checklist content (SF/NT/ST/NF, SC/CP/PB/BS)` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 36 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `typeCode.js strict parser/validator` connect `OPS Rules and Notation` to `Type Code Parser and Molecule`, `Reading Tab Design Spec`?**
  _High betweenness centrality (0.178) - this node is a cross-community bridge._
- **What connects `CLAUDE.md project instructions`, `Reset button`, `Legacy FastAPI backend (fractal generator)` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `OPS Rules and Notation` be split into smaller, more focused modules?**
  _Cohesion score 0.07564102564102564 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Build and Deploy Setup` to `App State and Handlers`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Should `App State and Handlers` be split into smaller, more focused modules?**
  _Cohesion score 0.1076923076923077 - nodes in this community are weakly interconnected._
- **Why does `OPS Elimination Tool README` connect `OPS Rules and Notation` to `Build and Deploy Setup`, `Reading Tab Design Spec`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Should `Build and Deploy Setup` be split into smaller, more focused modules?**
  _Cohesion score 0.07862903225806452 - nodes in this community are weakly interconnected._