---
id: disjunction
title: 'Disjunction'
prerequisites:
  - id: truth_functions_intro
    weight: 0.5
  - id: atomic_sentences
    weight: 0.5
---

# Disjunction: The "Or" Connective

Disjunction joins two sentences with "or." In TFL, we write disjunction with the symbol $\lor$.

$(A \lor B)$ means "$A$ or $B$." The two parts joined by $\lor$ are called **disjuncts**: $A$ is the left disjunct and $B$ is the right disjunct.

---

## Worked Example: Translating disjunction

**Sentence:** "Either the bus is late or the schedule changed."

**Symbolization key:** $B$: The bus is late. $S$: The schedule changed.

**Steps:**

1. "Either...or" signals disjunction.
2. Left disjunct: "The bus is late" = $B$.
3. Right disjunct: "The schedule changed" = $S$.
4. **Answer: $(B \lor S)$**

---

**Sentence:** "The package will arrive today or tomorrow."

**Symbolization key:** $D$: The package will arrive today. $M$: The package will arrive tomorrow.

**Steps:**

1. "Or" signals disjunction. Paraphrase: "Either the package will arrive today, or the package will arrive tomorrow."
2. Left disjunct: $D$. Right disjunct: $M$.
3. **Answer: $(D \lor M)$**

---

:::problem{tags="translate-disjunction"}
:::

---

# Computing Truth Values for Disjunction

A disjunction $(A \lor B)$ is true when at least one disjunct is true. It is false only when both disjuncts are false.

| $A$ | $B$ | $A \lor B$ |
| --- | --- | ---------- |
| T   | T   | **T**      |
| T   | F   | **T**      |
| F   | T   | **T**      |
| F   | F   | F          |

---

## Worked Example: Computing disjunction truth values

**Problem:** Suppose $P$ is true and $Q$ is false. What is the truth value of $(P \lor Q)$?

**Steps:**

1. $P$ is true.
2. At least one disjunct is true.
3. **$(P \lor Q)$ is true.**

---

**Problem:** Suppose $A$ is false and $B$ is false. What is the truth value of $(A \lor B)$?

**Steps:**

1. $A$ is false.
2. $B$ is false.
3. Neither disjunct is true.
4. **$(A \lor B)$ is false.**

---

:::problem{tags="compute-disjunction"}
:::

---

# Exclusive vs. Inclusive Or

In everyday English, "or" is often **exclusive**: "you may have soup or salad" typically means one but not both. In logic, $\lor$ is always **inclusive**: the disjunction is true even when both disjuncts are true.

The difference shows up only when both parts are true. Inclusive or says True; exclusive or says False.

When symbolizing in TFL, _always use inclusive_ $\lor$ unless told otherwise. You will learn how to express exclusive or using a combination of connectives in a later lesson.

How to tell them apart in English:

- "You may have soup _or_ salad" (restaurant menu): likely _exclusive_ (not both).
- "Applicants must have a degree _or_ five years of experience": likely _inclusive_ (having both still qualifies).

---

## Worked Example: Exclusive vs. inclusive

**Question:** "The door is locked or the alarm is on." Both happen to be true. Is the disjunction true under inclusive or?

**Steps:**

1. Inclusive or: at least one must be true.
2. Both are true. At least one is true.
3. **Under inclusive or, $(L \lor A)$ is true.**
4. (Under exclusive or, this would be false because both are true. But TFL uses inclusive or.)

---

**Question:** A restaurant menu says "Entrees come with soup or salad." Is this likely inclusive or exclusive?

**Steps:**

1. In restaurant contexts, "or" typically means you get one but not both.
2. If you want both, you pay extra.
3. **This is likely exclusive or.**
4. In TFL, we still symbolize it as $(S \lor A)$ using inclusive or. A later lesson covers how to express the exclusive reading.

---

:::problem{tags="exclusive-vs-inclusive"}
:::
