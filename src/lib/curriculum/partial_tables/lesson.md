---
id: partial_tables
title: 'Partial Truth Tables'
prerequisites:
  - id: logical_consequence
    weight: 0.7
---

# Partial Truth Tables: One Row Is Enough

A complete truth table evaluates every row. A **partial truth table** constructs just one row to answer a specific question. This is much faster when you only need a single example.

When do you use a partial truth table? When you need to **show that something fails**:

- To show a formula is **not a tautology**: find one row where it is false.
- To show a formula is **not a contradiction**: find one row where it is true.
- To show two formulas are **not equivalent**: find one row where they differ.
- To show a set of sentences is **jointly satisfiable**: find one row where all are true.
- To show an argument is **invalid**: find one row where all premises are true and the conclusion is false.

When you need to show that something **holds in every case** (is a tautology, is a contradiction, is valid), you still need a complete truth table. A partial table cannot prove "for all rows."

---

## Worked Example: Showing a formula is not a tautology

**Formula:** $(A \land B) \to (C \land D)$

**Goal:** Find a single valuation that makes the formula false.

**Steps:**

1. The main operator is $\to$. A conditional is false only when the antecedent is true and the consequent is false.
2. So we need $(A \land B)$ = T and $(C \land D)$ = F.
3. For $(A \land B)$ = T: set $A$ = T and $B$ = T.
4. For $(C \land D)$ = F: at least one must be false. Set $C$ = F and $D$ = F.
5. Check: $(T \land T) \to (F \land F)$ = $T \to F$ = F.
6. **The formula is false when $A$ = T, $B$ = T, $C$ = F, $D$ = F.**

| $A$ | $B$ | $C$ | $D$ | $(A \land B)$ | $(C \land D)$ | $(A \land B) \to (C \land D)$ |
| --- | --- | --- | --- | ------------- | ------------- | ----------------------------- |
| T   | T   | F   | F   | T             | F             | **F**                         |

7. **Conclusion: not a tautology.**

---

## Worked Example: Showing a formula is not a contradiction

**Formula:** $(A \to B) \lor \neg A$

**Goal:** Find a single valuation that makes the formula true.

**Steps:**

1. The main operator is $\lor$. A disjunction is true when at least one disjunct is true.
2. Try making $\neg A$ true: set $A$ = F.
3. Then $\neg A$ = T, so the whole disjunction is true regardless of $B$.
4. Set $B$ = F (any value works).
5. Check: $(F \to F) \lor \neg F$ = $T \lor T$ = T.
6. **The formula is true when $A$ = F, $B$ = F.**

| $A$ | $B$ | $(A \to B)$ | $\neg A$ | $(A \to B) \lor \neg A$ |
| --- | --- | ----------- | -------- | ----------------------- |
| F   | F   | T           | T        | **T**                   |

7. **Conclusion: not a contradiction.**

---

:::problem{tags="partial-table-single"}
:::

---

# Working Backward to Prove Invalidity

To show an argument is invalid, you need one row where all premises are true and the conclusion is false.

**Procedure:**

1. Start with the conclusion. Set it to false. Work backward to determine what truth values the sentence letters must have.
2. Check whether those truth values make all premises true.
3. If yes, you have found a bad row. The argument is invalid.
4. If no, try a different way to make the conclusion false. If no assignment works, the argument may be valid (and you need a complete truth table to confirm).

---

## Worked Example: Proving an argument invalid

**Argument:** $P \to Q$, $Q$ $\therefore$ $P$

**Goal:** Find a row where both premises are true and the conclusion is false.

**Steps:**

1. Start with the conclusion: $P$ = F (to make it false).
2. Check premise 2: $Q$ must be T (for the premise to be true).
3. Check premise 1: $P \to Q$ = $F \to T$ = T (true, since false antecedent).
4. Both premises true, conclusion false.
5. **Bad row found: $P$ = F, $Q$ = T.**

| $P$ | $Q$ | $P \to Q$ (Premise) | $Q$ (Premise) | $P$ (Conclusion) |
| --- | --- | ------------------- | ------------- | ---------------- |
| F   | T   | **T**               | **T**         | **F**            |

6. **The argument is invalid.**

---

## Worked Example: Proving an argument invalid with three variables

**Argument:** $A \to B$, $A \to C$ $\therefore$ $B \to C$

**Goal:** Find a row where both premises are true and the conclusion is false.

**Steps:**

1. Start with the conclusion $B \to C$: set it to false. This requires $B$ = T and $C$ = F.
2. Now choose $A$. Check premise 1: $A \to B$. Since $B$ = T, this is true for any value of $A$. Check premise 2: $A \to C$. Since $C$ = F, this is true only if $A$ = F.
3. Set $A$ = F.
4. Verify: $A \to B$ = $F \to T$ = T. $A \to C$ = $F \to F$ = T. $B \to C$ = $T \to F$ = F.
5. All premises true, conclusion false.
6. **Bad row found: $A$ = F, $B$ = T, $C$ = F.**

| $A$ | $B$ | $C$ | $A \to B$ (Premise) | $A \to C$ (Premise) | $B \to C$ (Conclusion) |
| --- | --- | --- | ------------------- | ------------------- | ---------------------- |
| F   | T   | F   | **T**               | **T**               | **F**                  |

7. **The argument is invalid.**

---

:::problem{tags="partial-table-invalidity"}
:::
