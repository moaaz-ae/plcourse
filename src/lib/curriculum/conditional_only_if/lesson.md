---
id: conditional_only_if
title: 'The Conditional: Only If & Necessary/Sufficient Conditions'
prerequisites:
  - id: conditional_basics
    weight: 0.8
---

# "Only If"

You already know how to translate "if P, then Q" as $(P \to Q)$. Now consider a different phrase: **"only if."**

"P only if Q" means: $P$ cannot be true without $Q$ being true. So if $P$ is true, then $Q$ must be true:

**"P only if Q" translates to $(P \to Q)$.**

The rule: in "A only if B," the antecedent is $A$ (the part **before** "only if") and the consequent is $B$ (the part **after** "only if"). This is the opposite order from "if B, then A."

---

## Worked Example: Translating "only if"

**Sentence:** "The flight departs only if the runway is clear."

**Symbolization key:** $D$: The flight departs. $R$: The runway is clear.

**Steps:**

1. Identify "only if." The clause before it is "the flight departs" = $D$.
2. The clause after "only if" is "the runway is clear" = $R$.
3. In "A only if B," $A$ is the antecedent and $B$ is the consequent.
4. **Answer: $(D \to R)$**

---

**Sentence:** "Only if you pass all courses do you graduate."

**Symbolization key:** $G$: You graduate. $P$: You pass all courses.

**Steps:**

1. Identify the "only if": "only if you pass all courses". The clause following "only if" is the consequent: $P$.
2. The remaining part "do you graduate" is the antecedent: $G$.
3. Even with "only if" at the start, it still points to the consequent. "A only if B" becomes $(A \to B)$.
4. **Answer: $(G \to P)$**

---

:::problem{tags="translate-only-if"}
:::

---

# Necessary and Sufficient Conditions

The conditional $(P \to Q)$ expresses a relationship between two conditions:

- The antecedent $P$ is a **sufficient condition** for the consequent $Q$. If $P$ is true, that is enough to guarantee $Q$ is true.
- The consequent $Q$ is a **necessary condition** for the antecedent $P$. $P$ cannot be true unless $Q$ is true.

Example: "If it is raining, the ground is wet." $(R \to W)$.

- Rain ($R$) is a **sufficient** condition for the ground being wet ($W$). Rain guarantees wet ground.
- Wet ground ($W$) is a **necessary** condition for rain ($R$). If the ground is not wet, it is not raining (though the ground could be wet for other reasons).

The key distinction:

- **Sufficient** = "enough to guarantee." The antecedent is sufficient for the consequent.
- **Necessary** = "required, cannot do without." The consequent is necessary for the antecedent.

---

## Worked Example: Identifying necessary and sufficient conditions

**Conditional:** "If the battery is charged, the phone turns on." $(B \to P)$

**Steps:**

1. Antecedent: $B$ (battery charged). Consequent: $P$ (phone turns on).
2. The antecedent is the sufficient condition: a charged battery is sufficient for the phone to turn on.
3. The consequent is the necessary condition: the phone turning on is necessary for a charged battery (if the phone does not turn on, the battery is not charged).
4. **$B$ is sufficient for $P$. $P$ is necessary for $B$.**

---

**Conditional:** "If the plant gets water, it survives." $(W \to S)$

**Steps:**

1. Antecedent: $W$ (gets water). Consequent: $S$ (survives).
2. Getting water is **sufficient** for survival.
3. Survival is **necessary** for getting water: if the plant does not survive, it did not get water.
4. **$W$ is sufficient for $S$. $S$ is necessary for $W$.**

---

:::problem{tags="necessary-sufficient"}
:::

---

# Connecting "Only If" to Necessary Conditions

"P only if Q" means Q is necessary for P. And "Q is necessary for P" means $(P \to Q)$.

All four conditional phrases reduce to the same formula:

- "If P, then Q" $\Rightarrow$ $(P \to Q)$
- "P only if Q" $\Rightarrow$ $(P \to Q)$
- "P is sufficient for Q" $\Rightarrow$ $(P \to Q)$
- "Q is necessary for P" $\Rightarrow$ $(P \to Q)$

---

## Worked Example: Translating necessary/sufficient condition sentences

**Sentence:** "For the concert to happen, it is necessary that tickets sell out."

**Symbolization key:** $C$: The concert happens. $S$: Tickets sell out.

**Steps:**

1. "Necessary" signals the consequent. Tickets selling out ($S$) is necessary for the concert happening ($C$).
2. The conditional structure: $(C \to S)$.
3. **Answer: $(C \to S)$**

---

**Sentence:** "Passing the exam is sufficient for graduation."

**Symbolization key:** $E$: You pass the exam. $G$: You graduate.

**Steps:**

1. "Sufficient" signals the antecedent. Passing the exam ($E$) is sufficient for graduation ($G$).
2. The conditional structure: $(E \to G)$.
3. **Answer: $(E \to G)$**

---

:::problem{tags="translate-nec-suff"}
:::
