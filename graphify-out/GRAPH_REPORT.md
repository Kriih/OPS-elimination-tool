# Graph Report - OPS-elimination-tool  (2026-11-10)

## Corpus Check
- 17 files · ~20,969 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 186 nodes · 370 edges · 12 communities (11 shown, 1 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `439149e5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- validate() system rules
- App State and Handlers
- Build and Deploy Setup
- Type Code Parser and Molecule
- Reading Tab Rendering
- Molecule.jsx function-stack SVG
- typeCode.js strict parser/validator
- Agent Instructions
- checklistData.js checklist content (5 sections)
- SHORT_CODE regex
- Type Grid (128 types)
- typeGrid.js system data (GRID_ROWS, FADE_RULES, TOTEMS)

## God Nodes (most connected - your core abstractions)
1. `App()` - 26 edges
2. `ReadingTab()` - 12 edges
3. `typeCode.js strict parser/validator` - 10 edges
4. `TotemCurve()` - 9 edges
5. `readPaste()` - 9 edges
6. `selectionsFromCell()` - 9 edges
7. `Molecule()` - 7 edges
8. `validate()` - 7 edges
9. `mbtiTypeFromCell()` - 7 edges
10. `validate() system rules` - 7 edges

## Surprising Connections (you probably didn't know these)
- `frontend/index.html entry page` --conceptually_related_to--> `Vite base /OPS-elimination-tool/`  [INFERRED]
  frontend/index.html → contexto.md
- `INFO/ENERGY from last animal` --semantically_similar_to--> `OPS I/E from last animal rule`  [INFERRED] [semantically similar]
  como-se-lee.md → contexto.md
- `Type Grid (128 types)` --conceptually_related_to--> `Grid legend chips (ExxP/IxxJ/ExxJ/IxxP)`  [INFERRED]
  README.md → contexto.md
- `MBTI code derivation (I/E from 1st Savior, J/P from primary axis)` --rationale_for--> `Resulting code (MBTI + type code)`  [INFERRED]
  contexto.md → README.md
- `checklistData.js checklist content (5 sections)` --shares_data_with--> `Checklist / Traits / Interpretation / Emoji tabs`  [EXTRACTED]
  contexto.md → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Reading tab building blocks** — readme_reading_tab, contexto_molecule_component, contexto_totemcurve_component, contexto_readingdata_module, como_se_lee_incomplete_type_states [EXTRACTED 1.00]
- **Strict type-code parse/validate pipeline** — como_se_lee_short_code_regex, como_se_lee_long_code_regex, como_se_lee_validate_rules, contexto_typecode_module, contexto_read_paste_dispatch, readme_paste_box [EXTRACTED 1.00]
- **Coins derived from the last animal** — contexto_ops_ie_last_animal_rule, como_se_lee_info_energy_last_animal, como_se_lee_double_activated_animal, contexto_four_animal_ranking [INFERRED 0.85]

## Communities (12 total, 1 thin omitted)

### Community 0 - "validate() system rules"
Cohesion: 0.29
Nodes (9): Animal formulas (Sleep=Oi+Di, Play=Oe+De, Consume=Oe+Di, Blast=Oi+De), Doubly activated animal = opposite of last, First animal formed by the two Saviors, INFO/ENERGY from last animal, validate() system rules, Coin / toggle (nullable binary question), Four-animal ranking (Sleep/Consume/Blast/Play), Grid legend chips (ExxP/IxxJ/ExxJ/IxxP) (+1 more)

### Community 1 - "App State and Handlers"
Cohesion: 0.10
Nodes (31): App(), applyBinaryString(), handleBinaryChange(), handleGridCellClick(), handleLegendClick(), isFaded(), legendActive(), mergeAmbiguousCode() (+23 more)

### Community 2 - "Build and Deploy Setup"
Cohesion: 0.08
Nodes (28): Port 5173 conflict with troppo Docker stack, frontend/index.html entry page, #root mount + /src/main.jsx module script, dependencies, react@^18.3.1, react-dom@^18.3.1, devDependencies, gh-pages@^6.3.0 (+20 more)

### Community 3 - "Type Code Parser and Molecule"
Cohesion: 0.12
Nodes (27): handlePasteCode(), Axis(), FN_CLASS, Molecule(), Node(), POSITIONS, radiusOf(), ROLE_LABELS (+19 more)

### Community 4 - "Reading Tab Rendering"
Cohesion: 0.18
Nodes (20): CodeText(), COIN_READINGS, MAIN_COIN_COUNT, PENDING, CardHead(), coinStates(), faceOf(), MissingModalityCard() (+12 more)

### Community 5 - "Molecule.jsx function-stack SVG"
Cohesion: 0.24
Nodes (8): Incomplete type states (marked/deduced/undecided/missing), Function-stack molecule diagram spec, Opposite axes 90/10 (poles) and 60/40 (middle), -7..+7 extraversion scale (TOTEMS score), Reading tab work order (steps 1-6), Molecule.jsx function-stack SVG, TotemCurve.jsx normal curve, Reading tab

### Community 6 - "typeCode.js strict parser/validator"
Cohesion: 0.19
Nodes (11): como-se-lee.md Reading tab plan/spec, contexto.md project context, Objective Personality System (OPS), typeCode.js strict parser/validator, OPS Elimination Tool README, Editable 11-digit binary, Elimination Tool (9 coin toggle rows), Legacy FastAPI backend (fractal generator) (+3 more)

### Community 8 - "checklistData.js checklist content (5 sections)"
Cohesion: 0.38
Nodes (7): CognitiveNotes project (reading content author), Coin card content structure (250-450 words), COIN_READINGS / TYPE_READINGS data format, checklistData.js checklist content (5 sections), PDF "OPS traducido", readingData.js coin readings (PENDING texts), Synthesized checklist content (SF/NT/ST/NF, SC/CP/PB/BS)

### Community 9 - "SHORT_CODE regex"
Cohesion: 0.40
Nodes (6): LONG_CODE regex, Long form (11 coins), SHORT_CODE regex, Short-form type code notation, Social type suffix #1-#4, Base test case MF-Ni/Fe-BP/C(S)

### Community 10 - "Type Grid (128 types)"
Cohesion: 0.40
Nodes (4): mergeAmbiguousCode (underscore merge of candidates), F/M Modalities (weak/strong, cat/dog), Resulting code (MBTI + type code), Type Grid (128 types)

### Community 11 - "typeGrid.js system data (GRID_ROWS, FADE_RULES, TOTEMS)"
Cohesion: 0.40
Nodes (4): typeGrid.js system data (GRID_ROWS, FADE_RULES, TOTEMS), alexanderehelmer.github.io (grid128 source), Checklist / Traits / Interpretation / Emoji tabs, subjectivepersonality.com (OPS Type Analyzer)

## Knowledge Gaps
- **8 isolated node(s):** `Doubly activated animal = opposite of last`, `Port 5173 conflict with troppo Docker stack`, `Opposite axes 90/10 (poles) and 60/40 (middle)`, `Legacy FastAPI backend (fractal generator)`, `Reset button` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 37 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `typeCode.js strict parser/validator` connect `typeCode.js strict parser/validator` to `validate() system rules`, `Type Code Parser and Molecule`, `Molecule.jsx function-stack SVG`, `SHORT_CODE regex`, `typeGrid.js system data (GRID_ROWS, FADE_RULES, TOTEMS)`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **What connects `Doubly activated animal = opposite of last`, `Port 5173 conflict with troppo Docker stack`, `Opposite axes 90/10 (poles) and 60/40 (middle)` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App State and Handlers` be split into smaller, more focused modules?**
  _Cohesion score 0.10384615384615385 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Build and Deploy Setup` to `App State and Handlers`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Should `Build and Deploy Setup` be split into smaller, more focused modules?**
  _Cohesion score 0.07862903225806452 - nodes in this community are weakly interconnected._
- **Why does `OPS Elimination Tool README` connect `typeCode.js strict parser/validator` to `Build and Deploy Setup`, `Type Grid (128 types)`, `Molecule.jsx function-stack SVG`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Should `Type Code Parser and Molecule` be split into smaller, more focused modules?**
  _Cohesion score 0.11576354679802955 - nodes in this community are weakly interconnected._