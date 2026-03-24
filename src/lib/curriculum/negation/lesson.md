---
id: negation
title: 'Negation'
prerequisites:
  - id: truth_functions_intro
    weight: 0.5
  - id: atomic_sentences
    weight: 0.5
---

# Negation: The "Not" Connective

Negation represents the word "not" in English. In TFL, we write negation with the symbol $\neg$.

If $P$ is a sentence, then $\neg P$ is its negation. $\neg P$ means "it is not the case that $P$."

---

## Worked Example: Translating negation

**Sentence:** "The store is not open."

**Symbolization key:** $S$: The store is open.

**Steps:**

1. Identify the base claim: "The store is open."
2. The sentence says "not," which negates the base claim.
3. The base claim is $S$, so the negation is $\neg S$.
4. **Answer: $\neg S$**

---

**Sentence:** "It is not the case that the flight has landed."

**Symbolization key:** $L$: The flight has landed.

**Steps:**

1. "It is not the case that..." is a standard negation phrase.
2. The base claim is "The flight has landed," which is $L$.
3. **Answer: $\neg L$**

---

:::problem{tags="translate-negation"}
:::

---

# Negation and Truth Values

Negation flips a sentence's truth value. If a sentence is true, its negation is false. If a sentence is false, its negation is true.

| $P$ | $\neg P$ |
| --- | -------- |
| T   | F        |
| F   | T        |

---

## Worked Example: Computing truth values

**Problem:** Suppose $A$ is true. What is the truth value of $\neg A$?

**Steps:**

1. $A$ is true.
2. Negation flips the truth value.
3. **$\neg A$ is false.**

---

:::problem{tags="compute-negation"}
:::

---

# Double Negation

What happens when you negate a negation? You flip the truth value twice, returning to where you started.

| $P$ | $\neg P$ | $\neg \neg P$ |
| --- | -------- | ------------- |
| T   | F        | T             |
| F   | T        | F             |

$\neg \neg P$ always has the same truth value as $P$. Negating twice returns you to the original truth value.

"The widget is _not_ irreplaceable" means the widget is replaceable. The prefix "ir-" acts as one negation, and "not" acts as a second. Two negations cancel out.

---

## Worked Example: Double negation

**Problem:** $R$ means "The widget is replaceable." What does $\neg \neg R$ mean, and what is its truth value if $R$ is true?

**Steps:**

1. $R$ means "The widget is replaceable."
2. $\neg R$ means "It is not the case that the widget is replaceable" (i.e., the widget is irreplaceable).
3. $\neg \neg R$ means "It is not the case that the widget is irreplaceable" (i.e., the widget is replaceable).
4. $\neg \neg R$ has the same truth value as $R$.
5. Since $R$ is true, **$\neg \neg R$ is true.**

---

**Problem:** Suppose $H$ is false. What is the truth value of $\neg \neg H$?

**Steps:**

1. $H$ is false.
2. $\neg H$ flips it: true.
3. $\neg \neg H$ flips it again: false.
4. **$\neg \neg H$ is false**, the same as $H$.

---

:::problem{tags="double-negation"}
:::
