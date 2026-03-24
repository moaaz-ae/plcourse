---
id: conditional_basics
title: 'The Conditional: If... Then'
prerequisites:
  - id: scope
    weight: 0.2
  - id: truth_functions_intro
    weight: 0.3
  - id: atomic_sentences
    weight: 0.4
---

# The Material Conditional

The conditional connects two sentences with "if...then." In TFL, we write the conditional with the symbol $\to$.

$(P \to Q)$ means: "if $P$, then $Q$."

The two parts of a conditional have names:

- The **antecedent** is the sentence after "if" (the left side of $\to$).
- The **consequent** is the sentence after "then" (the right side of $\to$).

In $(P \to Q)$: $P$ is the antecedent; $Q$ is the consequent.

---

## Worked Example: Labeling antecedent and consequent

**Sentence:** "If the alarm sounds, the building is evacuated."

**Symbolization key:** $A$: The alarm sounds. $B$: The building is evacuated.

**Steps:**

1. "If... then" signals a conditional.
2. The antecedent (the "if" part): "the alarm sounds" = $A$.
3. The consequent (the "then" part): "the building is evacuated" = $B$.
4. **Antecedent: $A$. Consequent: $B$.**

---

**Sentence:** "If the test is negative, the patient is healthy."

**Symbolization key:** $N$: The test is negative. $H$: The patient is healthy.

**Steps:**

1. Antecedent: "the test is negative" = $N$.
2. Consequent: "the patient is healthy" = $H$.
3. **Antecedent: $N$. Consequent: $H$.**

---

:::problem{tags="label-conditional"}
:::

---

# Translating "If...Then" Sentences

To translate an "if...then" sentence: identify the antecedent (after "if") and the consequent (after "then"), assign sentence letters, and write $(antecedent \to consequent)$.

English does not always put "if" first. These all mean the same thing:

- "If it rains, the ground gets wet." ($R \to W$)
- "The ground gets wet if it rains." ($R \to W$)
- "Assuming it rains, the ground gets wet." ($R \to W$)

In every case, the antecedent is "it rains" and the consequent is "the ground gets wet." The word after "if" (or "assuming") is always the antecedent, regardless of its position in the sentence.

---

## Worked Example: Translating conditionals

**Sentence:** "If the battery is charged, the phone turns on."

**Symbolization key:** $B$: The battery is charged. $P$: The phone turns on.

**Steps:**

1. "If" appears before "the battery is charged," so that is the antecedent.
2. "The phone turns on" is the consequent.
3. **Answer: $(B \to P)$**

---

**Sentence:** "The concert is canceled if it snows."

**Symbolization key:** $S$: It snows. $C$: The concert is canceled.

**Steps:**

1. "If" appears before "it snows," so that is the antecedent, even though it comes second in the sentence.
2. "The concert is canceled" is the consequent.
3. **Answer: $(S \to C)$**

---

:::problem{tags="translate-conditional"}
:::

---

# The Conditional's Truth Table

A conditional is false only when its antecedent is true and its consequent is false. In every other case, it is true.

| $P$ | $Q$ | $P \to Q$ |
| --- | --- | --------- |
| T   | T   | T         |
| T   | F   | **F**     |
| F   | T   | T         |
| F   | F   | T         |

---

# Vacuous Truth

The two bottom rows of the truth table may seem strange. When the antecedent is false, the conditional is true regardless of the consequent. This is called **vacuous truth**.

A conditional only makes a promise about what happens when the antecedent holds. If the antecedent does not hold, the promise is not broken.

Consider: "If it snows, the schools close." On a sunny day, it does not snow. The promise is not violated, because it never claimed anything about sunny days.

---

## Worked Example: Computing conditional truth values

**Problem:** Suppose $P$ is true and $Q$ is false. What is the truth value of $(P \to Q)$?

**Steps:**

1. $P$ is the antecedent: true.
2. $Q$ is the consequent: false.
3. True antecedent with false consequent: the conditional is false.
4. **$(P \to Q)$ is false.**

---

**Problem:** Suppose $A$ is false and $B$ is true. What is the truth value of $(A \to B)$?

**Steps:**

1. $A$ is the antecedent: false.
2. When the antecedent is false, the conditional is true (vacuous truth).
3. The truth value of $B$ does not matter here.
4. **$(A \to B)$ is true.**

---

**Problem:** Suppose $R$ is false and $S$ is false. What is the truth value of $(R \to S)$?

**Steps:**

1. $R$ is the antecedent: false.
2. False antecedent makes the conditional true, regardless of the consequent.
3. **$(R \to S)$ is true.**

---

:::problem{tags="compute-conditional"}
:::
