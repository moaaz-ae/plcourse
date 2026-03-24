---
id: sentence_properties
title: 'Logical Properties of Single Sentences'
prerequisites:
  - id: truth_tables_complex
    weight: 0.8
---

# Tautology, Contradiction, and Contingency

Every TFL formula falls into exactly one of three categories, determined by its main operator column in a complete truth table.

**Tautology:** true on every row. No matter what truth values the sentence letters take, the formula comes out true.

**Contradiction:** false on every row. No matter what truth values the sentence letters take, the formula comes out false.

**Contingency:** true on some rows and false on others. The formula's truth value depends on the valuation.

---

## Worked Example: Classifying a formula using a truth table

**Formula:** $P \lor \neg P$

**Steps:**

1. One sentence letter ($P$), so $2^1 = 2$ rows.
2. List the reference column ($P$).
3. Identify the part: $\neg P$.
4. Identify the final formula: $P \lor \neg P$.
5. Fill each column:

| $P$ | $\neg P$ | $P \lor \neg P$ |
| --- | -------- | --------------- |
| T   | F        | **T**           |
| F   | T        | **T**           |

5. The final column shows T on every row.
6. **Classification: tautology.**

---

**Formula:** $P \land \neg P$

**Steps:**

1. One sentence letter ($P$), so 2 rows.
2. List the reference column ($P$).
3. Identify the part: $\neg P$.
4. Identify the final formula: $P \land \neg P$.
5. Fill each column:

| $P$ | $\neg P$ | $P \land \neg P$ |
| --- | -------- | ---------------- |
| T   | F        | **F**            |
| F   | T        | **F**            |

5. The final column shows F on every row.
6. **Classification: contradiction.**

---

**Formula:** $P \to Q$

**Steps:**

1. Two sentence letters ($P, Q$), so 4 rows.
2. List reference columns ($P, Q$).
3. Identify the final formula: $P \to Q$.

| $P$ | $Q$ | $P \to Q$ |
| --- | --- | --------- |
| T   | T   | **T**     |
| T   | F   | **F**     |
| F   | T   | **T**     |
| F   | F   | **T**     |

3. Final column has a mix of T and F.
4. **Classification: contingency.**

---

:::problem{tags="classify-formula"}
:::

---

# Reading a Completed Truth Table

Given a completed truth table, you can classify the formula without recomputing anything. Focus on the main operator column:

- All T's: tautology.
- All F's: contradiction.
- Mix of T's and F's: contingency.

---

## Worked Example: Classifying from a completed table

**Given truth table for** $(A \land B) \to A$:

| $A$ | $B$ | $(A \land B)$ | $(A \land B) \to A$ |
| --- | --- | ------------- | ------------------- |
| T   | T   | T             | **T**               |
| T   | F   | F             | **T**               |
| F   | T   | F             | **T**               |
| F   | F   | F             | **T**               |

**Steps:**

1. The main operator is $\to$.
2. Its column reads: T, T, T, T.
3. All T's.
4. **Classification: tautology.**

---

**Given truth table for** $\neg (P \lor Q)$:

| $P$ | $Q$ | $(P \lor Q)$ | $\neg (P \lor Q)$ |
| --- | --- | ------------ | ----------------- |
| T   | T   | T            | **F**             |
| T   | F   | T            | **F**             |
| F   | T   | T            | **F**             |
| F   | F   | F            | **T**             |

**Steps:**

1. The main operator is $\neg$.
2. Its column reads: F, F, F, T.
3. Mix of T's and F's.
4. **Classification: contingency.**

---

:::problem{tags="classify-from-table"}
:::
