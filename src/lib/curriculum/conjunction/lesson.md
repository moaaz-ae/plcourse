---
id: conjunction
title: 'Conjunction'
prerequisites:
  - id: truth_functions_intro
    weight: 0.5
  - id: atomic_sentences
    weight: 0.5
---

# Conjunction: The "And" Connective

Conjunction joins two sentences with "and." In TFL, we write conjunction with the symbol $\land$.

$(A \land B)$ means "both $A$ and $B$." The two parts joined by $\land$ are called **conjuncts**: $A$ is the left conjunct and $B$ is the right conjunct.

---

## Worked Example: Translating conjunction

**Sentence:** "The coffee is hot and the milk is cold."

**Symbolization key:** $C$: The coffee is hot. $M$: The milk is cold.

**Steps:**

1. Identify the connective: "and" joins two claims.
2. Left conjunct: "The coffee is hot" = $C$.
3. Right conjunct: "The milk is cold" = $M$.
4. **Answer: $(C \land M)$**

---

**Sentence:** "Alice studied hard and passed the exam."

**Symbolization key:** $S$: Alice studied hard. $P$: Alice passed the exam.

**Steps:**

1. "And" joins two claims about Alice. Even though they share a subject, each claim gets its own sentence letter.
2. Left conjunct: "Alice studied hard" = $S$.
3. Right conjunct: "Alice passed the exam" = $P$.
4. **Answer: $(S \land P)$**

---

:::problem{tags="translate-conjunction"}
:::

---

# Computing Truth Values for Conjunction

A conjunction $(A \land B)$ is true only when both conjuncts are true. If either conjunct is false, the whole conjunction is false.

| $A$ | $B$ | $A \land B$ |
| --- | --- | ----------- |
| T   | T   | **T**       |
| T   | F   | F           |
| F   | T   | F           |
| F   | F   | F           |

---

## Worked Example: Computing conjunction truth values

**Problem:** Suppose $P$ is true and $Q$ is false. What is the truth value of $(P \land Q)$?

**Steps:**

1. $P$ is true.
2. $Q$ is false.
3. For $(P \land Q)$ to be true, _both_ must be true.
4. $Q$ is false, so the conjunction is false.
5. _$(P \land Q)$ is false._

---

**Problem:** Suppose $A$ is true and $B$ is true. What is the truth value of $(A \land B)$?

**Steps:**

1. $A$ is true.
2. $B$ is true.
3. Both conjuncts are true.
4. _$(A \land B)$ is true._

---

:::problem{tags="compute-conjunction"}
:::

---

# "But," "Yet," and "Although" Are Conjunction

Many English words besides "and" express conjunction: "but," "yet," "although," and "however." These words suggest contrast or surprise in tone, but they have identical truth conditions. A sentence joined by "but" is true exactly when both parts are true, and false otherwise.

Logic tracks only truth values, not tone. So all of these are symbolized as $(A \land B)$.

---

## Worked Example: Translating "but" and "although"

**Sentence:** "The food is cheap, but it is good."

**Symbolization key:** $C$: The food is cheap. $G$: The food is good.

**Steps:**

1. "But" signals conjunction. It works the same as "and."
2. Left conjunct: "The food is cheap" = $C$.
3. Right conjunct: "it is good" = $G$.
4. **Answer: $(C \land G)$**

---

**Sentence:** "Although the road was icy, no accidents occurred."

**Symbolization key:** $I$: The road was icy. $A$: No accidents occurred.

**Steps:**

1. "Although" signals conjunction. Same truth conditions as "and."
2. Left conjunct: "The road was icy" = $I$.
3. Right conjunct: "No accidents occurred" = $A$.
4. **Answer: $(I \land A)$**

---

:::problem{tags="but-yet-although"}
:::
