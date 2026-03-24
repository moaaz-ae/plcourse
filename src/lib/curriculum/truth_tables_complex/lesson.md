---
id: truth_tables_complex
title: 'Complex Truth Tables'
prerequisites:
  - id: truth_tables_simple
    weight: 1
---

# Three-Variable Truth Tables

With three sentence letters, the truth table has $2^3 = 8$ rows. The evaluation procedure is the same as with simpler formulas.

**Strategy for complex formulas:**

1. Set up reference columns using the halving method (8 rows for 3 letters).
2. Identify all sub-formulas, building from innermost to outermost.
3. Create a dedicated column for each sub-formula.
4. Evaluate each column based on the results of previous columns.
5. The final column reflects the truth value of the entire formula.

---

## Worked Example: Evaluating intermediate sub-formulas

**Formula:** $M \land (N \lor P)$

**Steps:**

1. Sentence letters: $M, N, P$. Three letters, so $2^3 = 8$ rows.
2. List the reference columns ($M, N, P$).
3. Identify the first part: $(N \lor P)$.
4. Identify the final formula: $M \land (N \lor P)$.
5. Evaluate $(N \lor P)$ first, then evaluate the conjunction with $M$.

| $M$ | $N$ | $P$ | $(N \lor P)$ | $M \land (N \lor P)$ |
| --- | --- | --- | ------------ | -------------------- |
| T   | T   | T   | T            | **T**                |
| T   | T   | F   | T            | **T**                |
| T   | F   | T   | T            | **T**                |
| T   | F   | F   | F            | **F**                |
| F   | T   | T   | T            | **F**                |
| F   | T   | F   | T            | **F**                |
| F   | F   | T   | T            | **F**                |
| F   | F   | F   | F            | **F**                |

Row 4: $N \lor P$ is F, so $M \land (N \lor P)$ is F.
Row 5: $N \lor P$ is T, but $M$ is F, so $M \land (N \lor P)$ is F.

Final column: T, T, T, F, F, F, F, F.

---

:::problem{tags="intermediate-subformulas"}
:::

---

# Complete Three-Variable Truth Tables

Formulas with three or more connectives require evaluating several intermediate columns before reaching the main operator.

---

## Worked Example: Full three-variable evaluation

**Formula:** $(A \to B) \lor \neg C$

**Steps:**

1. Sentence letters: $A, B, C$. Three letters, so 8 rows.
2. List the reference columns ($A, B, C$).
3. Identify the parts: $(A \to B)$ and $\neg C$.
4. Identify the final formula: $(A \to B) \lor \neg C$.
5. Evaluate the conditional, then the negation, then final disjunction.

| $A$ | $B$ | $C$ | $(A \to B)$ | $\neg C$ | $(A \to B) \lor \neg C$ |
| --- | --- | --- | ----------- | -------- | ----------------------- |
| T   | T   | T   | T           | F        | **T**                   |
| T   | T   | F   | T           | T        | **T**                   |
| T   | F   | T   | F           | F        | **F**                   |
| T   | F   | F   | F           | T        | **T**                   |
| F   | T   | T   | T           | F        | **T**                   |
| F   | T   | F   | T           | T        | **T**                   |
| F   | F   | T   | T           | F        | **T**                   |
| F   | F   | F   | T           | T        | **T**                   |

Main operator column: T, T, F, T, T, T, T, T.

---

## Worked Example: A three-variable formula with negation and conjunction

**Formula:** $\neg (P \land Q) \to R$

**Steps:**

1. Sentence letters: $P, Q, R$. Three letters, so 8 rows.
2. List the reference columns ($P, Q, R$).
3. Identify the parts: $(P \land Q)$ and its negation $\neg (P \land Q)$.
4. Final formula: $\neg (P \land Q) \to R$.

| $P$ | $Q$ | $R$ | $(P \land Q)$ | $\neg (P \land Q)$ | $\neg (P \land Q) \to R$ |
| --- | --- | --- | ------------- | ------------------ | ------------------------ |
| T   | T   | T   | T             | F                  | **T**                    |
| T   | T   | F   | T             | F                  | **T**                    |
| T   | F   | T   | F             | T                  | **T**                    |
| T   | F   | F   | F             | T                  | **F**                    |
| F   | T   | T   | F             | T                  | **T**                    |
| F   | T   | F   | F             | T                  | **F**                    |
| F   | F   | T   | F             | T                  | **T**                    |
| F   | F   | F   | F             | T                  | **F**                    |

Main operator column: T, T, T, F, T, F, T, F.

---

:::problem{tags="three-variable-table"}
:::
