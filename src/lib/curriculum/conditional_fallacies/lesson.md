---
id: conditional_fallacies
title: 'Fallacies of the Conditional'
prerequisites:
  - id: conditional_basics
    weight: 0.8
  - id: validity
    weight: 0.5
---

# Affirming the Consequent

Consider this argument:

1. If it is raining, the ground is wet.
2. The ground is wet.
3. Therefore, it is raining.

This looks reasonable at first. But is it valid? The ground could be wet for another reason: a sprinkler, a burst pipe, morning dew. The argument assumes the only way for the consequent to be true is for the antecedent to be true. That assumption is wrong.

This pattern has a name: **the Fallacy of Affirming the Consequent**. Its form:

1. $P \to Q$
2. $Q$
3. Therefore, $P$.

This argument is **invalid**. A conditional tells you: if the antecedent is true, then the consequent is true. It does not tell you: if the consequent is true, the antecedent must be true.

---

## Worked Example: Spotting Affirming the Consequent

**Argument:**

1. If the alarm sounds, the building is evacuated.
2. The building is evacuated.
3. Therefore, the alarm sounded.

**Steps:**

1. Identify the conditional: premise 1 is $(A \to B)$. Antecedent: $A$ (the alarm sounds). Consequent: $B$ (the building is evacuated).
2. Premise 2 asserts the consequent $B$.
3. The conclusion asserts the antecedent $A$.
4. This matches the pattern of Affirming the Consequent: $(P \to Q)$, $Q$, therefore $P$.
5. Counterexample: the building could be evacuated for a fire drill, not an alarm.
6. **The argument is invalid: it commits the Fallacy of Affirming the Consequent.**

---

**Argument:**

1. The patient is sick if the test is positive.
2. The patient is sick.
3. Therefore, the test is positive.

**Steps:**

1. Identify the conditional: "The patient is sick if the test is positive." The "if" part is the antecedent: $R$ (the test is positive). The other part is the consequent: $S$ (the patient is sick). Premise 1 is $(R \to S)$.
2. Premise 2 asserts the consequent $S$.
3. The conclusion asserts the antecedent $R$.
4. This is Affirming the Consequent.
5. Counterexample: the patient could be sick but the test might have produced a false negative.
6. **Invalid: Affirming the Consequent.**

---

:::problem{tags="affirm-consequent"}
:::

---

# Denying the Antecedent

Here is another tempting but invalid pattern:

1. If it is raining, the ground is wet.
2. It is not raining.
3. Therefore, the ground is not wet.

Again, the ground could be wet for some other reason. The conditional only says what happens when the antecedent is true. It says nothing about what happens when the antecedent is false. A conditional with a false antecedent is true regardless of the consequent.

This pattern is **the Fallacy of Denying the Antecedent**. Its form:

1. $P \to Q$
2. Not $P$.
3. Therefore, not $Q$.

This argument is **invalid**. A false antecedent does not force the consequent to be false. The consequent might be true for a different reason.

---

## Worked Example: Spotting Denying the Antecedent

**Argument:**

1. If the store is open, we can buy groceries.
2. The store is not open.
3. Therefore, we cannot buy groceries.

**Steps:**

1. Premise 1: $(S \to G)$. Antecedent: $S$ (the store is open). Consequent: $G$ (we can buy groceries).
2. Premise 2 denies the antecedent: not $S$.
3. The conclusion denies the consequent: not $G$.
4. This matches the pattern of Denying the Antecedent: $(P \to Q)$, not $P$, therefore not $Q$.
5. Counterexample: the store is closed, but we buy groceries online.
6. **Invalid: Denying the Antecedent.**

---

**Argument:**

1. If the battery is dead, the phone is off.
2. The battery is not dead.
3. Therefore, the phone is not off.

**Steps:**

1. Premise 1: $(B \to P)$. Premise 2 denies the antecedent: not $B$.
2. The conclusion denies the consequent: not $P$.
3. This is Denying the Antecedent.
4. Counterexample: the battery is fine, but the phone is off because you turned it off.
5. **Invalid: Denying the Antecedent.**

---

:::problem{tags="deny-antecedent"}
:::

---

# Why Vacuous Truth Matters

Both fallacies stem from the same root: misunderstanding what a conditional says when the antecedent is false.

The truth table for $P \to Q$:

| $P$ | $Q$ | $P \to Q$ |
| --- | --- | --------- |
| T   | T   | T         |
| T   | F   | **F**     |
| F   | T   | T         |
| F   | F   | T         |

Rows 3 and 4 are the key. When $P$ is false, the conditional is true no matter what $Q$ is. This is vacuous truth.

- **Denying the Antecedent** ignores rows 3 and 4. It assumes that when $P$ is false, $Q$ must also be false. But row 3 shows $Q$ can be true even when $P$ is false.
- **Affirming the Consequent** ignores that $Q$ being true does not pin down $P$. Rows 1 and 3 both have $Q$ true, but $P$ is true in row 1 and false in row 3.

A conditional constrains only one case: when the antecedent is true, the consequent must be true. It places no constraints on what happens when the antecedent is false, and no constraints on what the antecedent is when the consequent is true.

---

## Worked Example: Using the truth table to explain invalidity

**Claim:** "If the antecedent is false, then the consequent must be false."

**Steps:**

1. Check the truth table rows where the antecedent is false: rows 3 and 4.
2. In row 3, $P$ is false and $Q$ is true. The conditional is true.
3. In row 4, $P$ is false and $Q$ is false. The conditional is true.
4. Both rows are possible when the conditional is true. So a false antecedent does not force the consequent to be false.
5. **The claim is false. This is exactly why Denying the Antecedent is invalid.**

---

:::problem{tags="vacuous-truth-explain"}
:::
