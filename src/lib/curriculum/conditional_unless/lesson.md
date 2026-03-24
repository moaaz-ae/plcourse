---
id: conditional_unless
title: 'The Conditional: Unless & Provided That'
prerequisites:
  - id: conditional_only_if
    weight: 0.5
  - id: conditional_basics
    weight: 0.7
  - id: negation
    weight: 0.3
---

# Translating "Unless"

The word "unless" is a conditional in disguise. "P unless Q" means: if Q does not happen, then P happens. A helpful way to remember this is that **unless** effectively means **if not**.

The translation rule:

**"P unless Q" translates to $(\neg Q \to P)$.**

To apply the rule, identify the two clauses and determine which one follows "unless." That clause gets negated and becomes the antecedent.

---

## Worked Example: Translating "unless" sentences

**Sentence:** "The game is canceled unless the rain stops."

**Symbolization key:** $G$: The game is canceled. $R$: The rain stops.

**Steps:**

1. Replace "unless" with "if not": "The game is canceled **if not** the rain stops."
2. The clause after "if not" is the antecedent: "the rain stops" = $R$. It is negated: $\neg R$.
3. The other clause is the consequent: "the game is canceled" = $G$.
4. **Answer: $(\neg R \to G)$**

---

**Sentence:** "Unless you study, you will fail the exam."

**Symbolization key:** $S$: You study. $E$: You will fail the exam.

**Steps:**

1. Replace "unless" with "if not": "**If not** you study, you will fail the exam."
2. The clause after "if not" is the antecedent: "you study" = $S$. It is negated: $\neg S$.
3. The other clause is the consequent: "you will fail the exam" = $E$.
4. **Answer: $(\neg S \to E)$**

---

:::problem{tags="translate-unless"}
:::

---

# Translating "Provided That"

"Provided that" works just like "if." The clause after "provided that" is the antecedent.

**"P provided that Q" translates to $(Q \to P)$.**

---

## Worked Example: Translating "provided that" sentences

**Sentence:** "The experiment succeeds provided that the temperature stays constant."

**Symbolization key:** $E$: The experiment succeeds. $C$: The temperature stays constant.

**Steps:**

1. "Provided that" introduces the antecedent: "the temperature stays constant" = $C$.
2. The consequent is "the experiment succeeds" = $E$.
3. $(C \to E)$.
4. **Answer: $(C \to E)$**

---

**Sentence:** "Provided that the server is online, the website loads."

**Symbolization key:** $S$: The server is online. $W$: The website loads.

**Steps:**

1. "Provided that" introduces the antecedent: $S$.
2. Consequent: $W$.
3. $(S \to W)$.
4. **Answer: $(S \to W)$**

---

:::problem{tags="translate-provided-that"}
:::
