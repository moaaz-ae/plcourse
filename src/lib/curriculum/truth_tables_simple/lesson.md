---
id: truth_tables_simple
title: 'Simple Truth Tables'
prerequisites:
  - id: truth_table_setup
    weight: 0.8
---

# Evaluating a Complete Truth Table

Once the reference columns are filled in, you evaluate the formula piece-by-piece. Each sub-formula gets its own column, building up to the final formula.

**Procedure:**

1. Identify every part (sub-formula) of the main formula.
2. Create a column for each part, starting from the smallest (innermost) parts.
3. Evaluate each column row-by-row based on the values in previous columns.
4. The final column shows the truth value of the entire formula.

---

## Worked Example: One-variable truth table

**Formula:** $\neg \neg P$

**Steps:**

1. One sentence letter ($P$), so $2^1 = 2$ rows.
2. List the reference column ($P$).
3. Identify the first part: $\neg P$.
4. Identify the final formula: $\neg \neg P$.
5. Fill each column based on the previous ones.

| $P$ | $\neg P$ | $\neg \neg P$ |
| --- | -------- | ------------- |
| T   | F        | **T**         |
| F   | T        | **F**         |

The final column matches $P$ on every row.

---

## Worked Example: Two-variable truth table with conjunction

**Formula:** $(P \land Q)$

**Steps:**

1. Two sentence letters ($P, Q$), so $2^2 = 4$ rows.
2. List the reference columns ($P, Q$).
3. The formula has no intermediate sub-parts.
4. Evaluate the final formula $(P \land Q)$ directly from the reference columns.

| $P$ | $Q$ | $(P \land Q)$ |
| --- | --- | ------------- |
| T   | T   | **T**         |
| T   | F   | **F**         |
| F   | T   | **F**         |
| F   | F   | **F**         |

The formula is true only on the first row where both $P$ and $Q$ are true.

---

:::problem{tags="simple-truth-table-eval"}
:::

---

# Two-Variable Formulas with Multiple Connectives

When a formula has more than one connective, evaluate sub-formulas step by step, always starting with the innermost parts.

---

## Worked Example: Two-variable truth table with negation and disjunction

**Formula:** $\neg P \lor Q$

**Steps:**

1. Two sentence letters ($P, Q$), so 4 rows.
2. List the reference columns ($P, Q$).
3. Identify the first part: $\neg P$.
4. Identify the final formula: $\neg P \lor Q$.
5. Evaluate $\neg P$ (flipping $P$), then evaluate $\lor$ using the $\neg P$ column and the $Q$ column.

| $P$ | $Q$ | $\neg P$ | $\neg P \lor Q$ |
| --- | --- | -------- | --------------- |
| T   | T   | F        | **T**           |
| T   | F   | F        | **F**           |
| F   | T   | T        | **T**           |
| F   | F   | T        | **T**           |

Final column: T, F, T, T.

---

## Worked Example: Two-variable truth table with conditional

**Formula:** $(P \land Q) \to P$

**Steps:**

1. Two sentence letters ($P, Q$), so 4 rows.
2. List the reference columns ($P, Q$).
3. Identify the first part: $(P \land Q)$.
4. Identify the final formula: $(P \land Q) \to P$.
5. Evaluate the conjunction $(P \land Q)$ first.
6. Evaluate the conditional ($\to$) using the $(P \land Q)$ column as the antecedent and the $P$ reference column as the consequent.

| $P$ | $Q$ | $(P \land Q)$ | $(P \land Q) \to P$ |
| --- | --- | ------------- | ------------------- |
| T   | T   | T             | **T**               |
| T   | F   | F             | **T**               |
| F   | T   | F             | **T**               |
| F   | F   | F             | **T**               |

Final column: T, T, T, T. This formula is true on every row.

---

:::problem{tags="multi-connective-simple"}
:::
