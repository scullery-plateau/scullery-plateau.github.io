# Text Sizing Constraints - Comprehensive Understanding

## Overview
This document outlines the requirements for a text layer sizing system in Svengali that ensures text remains readable (minimum 7pt font) and fits appropriately within defined text boxes on cards, whether populated manually or from data tables.

## Core Requirements

### 1. Readability & Printability
- **Minimum font size: 7pt** - This is the hard floor, ensuring text remains readable when the card is printed
- Text layers cannot be sized below a threshold where even a single character is unreadable

### 2. Text Box Constraints
- When users create/resize a text layer, the system must:
  - Calculate the **maximum word length** that can fit on a single line
  - Calculate the **maximum number of rows** that can fit in the box
  - Display this information in the UI to guide the user
  - Prevent the box from being reduced to a size where not even a single character fits

### 3. Character Capacity Limits
- Once box dimensions are finalized, a **maximum character count** is determined for that box
- This character limit is enforced as a constraint on:
  - Raw text input fields
  - Data table columns that populate the text layer
- This ensures data won't overflow the designated text space

### 4. Maximum Font Size Metadata
- Add a new metadata field to the text layer model that allows users to set a **maximum font size**
- Constraints on this field:
  - Minimum value: **7pt** (can't go below readable threshold)
  - Maximum value: **calculated based on the box dimensions** (the largest font that can fit a single row of text)
  - **Only required when text is populated from a data table** (raw input fields don't need this)
  - **Raw value only** - this field is not column-mappable from the data table

### 5. Text Input Restrictions
- Text input should be limited to **keyboard characters only**:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Punctuation marks
  - Spaces
  - Tabs
  - Carriage returns
  - Newlines
- This restriction prevents invalid/problematic characters from entering the system

### 6. Character Width Mapping
- Create a **character width mapping system** where each character maps to its **relative width ratio**
- The ratio should be: **character width ÷ font height**
- Purpose: Enable **pre-calculation of text layout** instead of post-calculation
  - Allows predictive layout analysis before rendering
  - Improves performance by avoiding repeated render-test cycles
  - More efficient than searching for the "right" font size through trial and error

### 7. Future Features (Out of Scope for Current Design)
- **Internationalization (i18n)** - Support for multiple languages
- **Markdown support** - Allow markdown formatting in text layers

## Implementation Approach

### Testing & Validation Strategy
Before implementing the text sizing algorithms, create a **demonstration/test suite**:

1. **Generation (Independent)**
   - Generate a set of text boxes with varying dimensions (within card bounds)
   - Generate a set of text blocks using Lorem Ipsum at different lengths
   - Keep text and box generators completely independent (no mutual awareness)

2. **Permutation Testing**
   - Test all combinations of text lengths with box sizes
   - For each combination, test all proposed sizing algorithms

3. **Metrics Captured**
   - Performance: Time to complete layout calculation
   - Accuracy: How well text fits within bounds
   - Algorithm comparison: Determine which algorithm works best for different scenarios

4. **Deliverable**
   - Create an HTML page in a separate subfolder
   - Display results visually
   - Allow comparison of different sizing approaches

## Key Design Decisions

1. **7pt as the readability floor** - This is a hard constraint that everything must respect
2. **Character width ratios** - Using font-height-relative measurements enables resolution-independent layout calculations
3. **Table-driven max font size only** - Avoids unnecessary UI complexity for raw text input
4. **Demonstration first** - Testing algorithms before implementation reduces rework and ensures selection of the best approach
5. **Character set restrictions** - Simplifies input validation and prevents edge cases with special/control characters

## Relationship to UI/UX
- Users need clear feedback about constraints when sizing text boxes (max word length, max rows)
- Maximum font size becomes a user-configurable setting but only when using data table population
- The character width mapping is invisible to users but affects visual accuracy of layout predictions
