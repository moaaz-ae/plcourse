---
id: logical_consequence
title: 'Logical Consequence & Formal Argument Evaluation'
prerequisites:
  - id: set_properties
    weight: 0.5
  - id: validity
    weight: 0.5
  - id: truth_tables_complex
    weight: 0.7
---

# Logical Consequence (Entailment)

A set of TFL sentences **entails** a sentence $C$ if there is no valuation that makes all the premises true and $C$ false. When this holds, we say $C$ is a **logical consequence** of the premises.

This is the formal version of the validity concept you learned earlier. An argument with premises $P_1, P_2, \ldots$ and conclusion $C$ is **tautologically valid** if and only if the premises entail $C$.

**The test:** build a truth table with all the premises and the conclusion. Look for a **bad row**: a row where every premise is true and the conclusion is false. If no bad row exists, the argument is valid. If even one bad row exists, the argument is invalid.

---

## Worked Example: Testing an argument with a joint truth table

**Argument:** $P \to Q$, $P$ $\therefore$ $Q$

**Steps:**

1. Sentence letters: $P$, $Q$. Four rows.
2. Evaluate all three formulas:

| $P$ | $Q$ | $P \to Q$ |
| --- | --- | --------- |
| T   | T   | T         |
| T   | F   | F         |
| F   | T   | T         |
| F   | F   | T         |

3. Check for bad rows (where every premise is true and conclusion is false):
   - Row 1: Premises ($P \to Q, P$) are both T. Conclusion ($Q$) is T. Not bad.
   - Row 2: Premise 1 ($P \to Q$) is F. Not bad.
   - Rows 3-4: Premise 2 ($P$) is F. Not bad.
4. No bad row exists.
5. **The argument is tautologically valid.**

---

**Argument:** $P \to Q$, $Q$ $\therefore$ $P$

**Steps:**

1. Two sentence letters ($P, Q$), so 4 rows.
2. Truth table:

| $P$ | $Q$ | $P \to Q$ |
| --- | --- | --------- |
| T   | T   | T         |
| T   | F   | F         |
| F   | T   | T         |
| F   | F   | T         |

3. Row 3: Premises ($P \to Q, Q$) are both T. Conclusion ($P$) is F. Both premises true, conclusion false.
4. Bad row found.
5. **The argument is tautologically invalid.**

---

:::problem{tags="test-validity-truth-table"}
:::

---

# Symbolizing and Evaluating English Arguments

To evaluate an English argument formally:

1. Assign sentence letters to each atomic English sentence (create a symbolization key).
2. Translate each premise and the conclusion into TFL.
3. Build a joint truth table.
4. Check for bad rows.

---

## Worked Example: From English to truth table

**Argument:** "If it rains, the ground is wet. It is raining. So the ground is wet."

**Symbolization key:** $R$: It rains. $W$: The ground is wet.

**Steps:**

1. Premise 1: $R \to W$. Premise 2: $R$. Conclusion: $W$.
2. Two sentence letters ($R, W$), so 4 rows.
3. Truth table:

| $R$ | $W$ | $R \to W$ |
| --- | --- | --------- |
| T   | T   | T         |
| T   | F   | F         |
| F   | T   | T         |
| F   | F   | T         |

3. Row 1: all premises true, conclusion true. Not bad.
4. Row 2: Premise 1 false. Not a bad row.
5. Rows 3-4: Premise 2 false. Not bad rows.
6. No bad row.
7. **The argument is valid.**

---

:::problem{tags="english-argument-evaluation"}
:::

---

# Tautological Conclusions

If the conclusion of an argument is a tautology, the argument is automatically valid, regardless of the premises. A tautology is true on every row, so there can never be a row where it is false. No bad row is possible.

---

## Worked Example: Argument with a tautological conclusion

**Argument:** $P$ $\therefore$ $Q \lor \neg Q$

**Steps:**

1. Two sentence letters ($P, Q$), so $2^2 = 4$ rows.
2. Identify the parts: Premise is $P$. Conclusion is $Q \lor \neg Q$.
3. Build a joint truth table:

| $P$ | $Q$ | $P$ (Premise) | $\neg Q$ | $Q \lor \neg Q$ (Conclusion) |
| --- | --- | ------------- | -------- | ---------------------------- |
| T   | T   | **T**         | F        | **T**                        |
| T   | F   | **T**         | T        | **T**                        |
| F   | T   | **F**         | F        | **T**                        |
| F   | F   | **F**         | T        | **T**                        |

4. Check for a bad row (Premise T, Conclusion F).
5. Since the conclusion is a tautology (true on every row), it is never F.
6. Therefore, no bad row is possible.
7. **The argument is valid.**

---

# Contradictory Premises

If all the premises are contradictions, the argument is also automatically valid. A contradiction is false on every row, so there is no row where all premises are true. No bad row is possible.

---

## Worked Example: Argument with a contradictory premise

**Argument:** $P \land \neg P$ $\therefore$ $Q$

**Steps:**

1. Two sentence letters ($P, Q$), so $2^2 = 4$ rows.
2. Identify the parts: Premise is $P \land \neg P$. Conclusion is $Q$.
3. Build a joint truth table:

| $P$ | $Q$ | $\neg P$ | $P \land \neg P$ (Premise) | $Q$ (Conclusion) |
| --- | --- | -------- | -------------------------- | ---------------- |
| T   | T   | F        | **F**                      | **T**            |
| T   | F   | F        | **F**                      | **F**            |
| F   | T   | T        | **F**                      | **T**            |
| F   | F   | T        | **F**                      | **F**            |

4. Check for a bad row (Premise T, Conclusion F).
5. Since the premise is a contradiction (false on every row), it is never T.
6. A bad row requires the premise to be T, so no bad row can exist.
7. **The argument is valid.**

---

:::problem{tags="tautology-validity"}
:::
