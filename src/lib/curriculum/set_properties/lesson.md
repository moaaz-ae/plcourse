---
id: set_properties
title: 'Logical Properties of Sentence Sets'
prerequisites:
  - id: sentence_properties
    weight: 0.4
  - id: truth_tables_complex
    weight: 0.8
---

# Logical Equivalence

Two TFL sentences are **logically equivalent** if they have the same truth value on every possible valuation. To test this, build a truth table for each formula and compare their final columns row by row.

**Test:** If the final columns of both tables match on every row, the sentences are equivalent. If they differ on even one row, they are not.

---

## Worked Example: Testing for equivalence

**Sentences:** $\neg (P \lor Q)$ and $(\neg P \land \neg Q)$

**Steps:**

1. Both sentences contain $P$ and $Q$. Two sentence letters, so $2^2 = 4$ rows.
2. Build the truth table for the first sentence, $\neg (P \lor Q)$:

| $P$ | $Q$ | $(P \lor Q)$ | $\neg (P \lor Q)$ |
| --- | --- | ------------ | ----------------- |
| T   | T   | T            | **F**             |
| T   | F   | T            | **F**             |
| F   | T   | T            | **F**             |
| F   | F   | F            | **T**             |

3. Build the truth table for the second sentence, $(\neg P \land \neg Q)$:

| $P$ | $Q$ | $\neg P$ | $\neg Q$ | $(\neg P \land \neg Q)$ |
| --- | --- | -------- | -------- | ----------------------- |
| T   | T   | F        | F        | **F**                   |
| T   | F   | F        | T        | **F**                   |
| F   | T   | T        | F        | **F**                   |
| F   | F   | T        | T        | **T**                   |

4. Compare the final columns of both tables. They match on every row: F, F, F, T.
5. **The sentences are logically equivalent.**

---

**Sentences:** $(P \to Q)$ and $(Q \to P)$

**Steps:**

1. Two sentence letters ($P, Q$), so 4 rows.
2. Build the truth table for the first sentence, $P \to Q$:

| $P$ | $Q$ | $P \to Q$ |
| --- | --- | --------- |
| T   | T   | **T**     |
| T   | F   | **F**     |
| F   | T   | **T**     |
| F   | F   | **T**     |

3. Build the truth table for the second sentence, $Q \to P$:

| $P$ | $Q$ | $Q \to P$ |
| --- | --- | --------- |
| T   | T   | **T**     |
| T   | F   | **T**     |
| F   | T   | **F**     |
| F   | F   | **T**     |

4. Compare the final columns. On Row 2, the first is F and the second is T.
5. **The sentences are not logically equivalent.**

---

:::problem{tags="test-equivalence"}
:::

---

# Satisfiability

A set of TFL sentences is **jointly satisfiable** if there is at least one valuation that makes all of them true at the same time. If no such valuation exists, the set is **jointly unsatisfiable**.

**Test:** Build a truth table with all the sentences. Look for a row where every sentence's main operator column shows T. One such row is enough to prove satisfiability. If no row has all T's, the set is unsatisfiable.

---

## Worked Example: Testing for satisfiability

**Sentences:** $A \lor B$, $\neg A$

**Steps:**

1. Two sentence letters, 4 rows.
2. Truth table:

| $A$ | $B$ | $A \lor B$ | $\neg A$ |
| --- | --- | ---------- | -------- |
| T   | T   | **T**      | **F**    |
| T   | F   | **T**      | **F**    |
| F   | T   | **T**      | **T**    |
| F   | F   | **F**      | **T**    |

3. Row 3: $A \lor B$ = T and $\neg A$ = T. Both true.
4. One row with all T's is enough.
5. **The set is jointly satisfiable.** (The satisfying valuation: $A$ = F, $B$ = T.)

---

**Sentences:** $P$, $\neg P$

**Steps:**

1. One sentence letter, 2 rows.
2. Truth table:

| $P$   | $\neg P$ |
| ----- | -------- |
| **T** | **F**    |
| **F** | **T**    |

3. Row 1: $P$ is T but $\neg P$ is F. Row 2: $P$ is F but $\neg P$ is T.
4. No row makes both true.
5. **The set is jointly unsatisfiable.**

---

:::problem{tags="test-satisfiability"}
:::
