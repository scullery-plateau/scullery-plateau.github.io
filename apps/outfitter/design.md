# Outfitter UI Design

## Current UI Mockup

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [=] Menu  Outfitter                                                         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────────┐  ┌────────────────────────────────────┐  │
│   │  +=== Layer Controls ===+   │  │                                    │  │
│   │                             │  │                                    │  │
│   │  Layer: [Select Layer ▼] │  │        Paper Doll Canvas           │  │
│   │            [+][-]           │  │        (Character Preview)        │  │
│   │                             │  │                                    │  │
│   │  [<<] [<] [>] [>>] [x]    │  │                                    │  │
│   │  [Flip]                     │  │                                    │  │
│   │                             │  │                                    │  │
│   │  Part Type: [Select Part▼]  │  │                                    │  │
│   │                             │  │                                    │  │
│   │  Part Index: [0] up/down    │  │                                    │  │
│   │  Shading: [0] up/down       │  │                                    │  │
│   │                             │  │                                    │  │
│   │  Position X: [-][val][+]    │  │                                    │  │
│   │  Position Y: [-][val][+]    │  │                                    │  │
│   │                             │  │                                    │  │
│   │  Scale X: [-][val][+]       │  │                                    │  │
│   │  Scale Y: [-][val][+]       │  │                                    │  │
│   │                             │  │                                    │  │
│   │  [Color Picker]             │  │                                    │  │
│   │  BG Color: [########]       │  │                                    │  │
│   │                             │  │                                    │  │
│   └─────────────────────────────┘  └────────────────────────────────────┘  │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  (c) 2024 Scullery Plateau | Privacy | About                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Layout Breakdown

- **Header**: Title + Menu (Download, Share, Image Download, About)
- **Left Column (≈40% width)**: RPG-styled control panel with:
  - Layer management (select/add/remove)
  - Layer reordering buttons
  - Flip control
  - Part type and index selection
  - Shading controls
  - Position (X/Y) adjustments with keyboard shortcuts
  - Scale (X/Y) adjustments with keyboard shortcuts
  - Color picker for the selected layer
  - Background color picker
- **Right Column (≈60% width)**: Paper doll canvas showing the character preview
