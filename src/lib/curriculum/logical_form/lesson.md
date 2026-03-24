---
id: logical_form
title: 'Logical Form & Formal Validity'
prerequisites:
  - id: validity
    weight: 0.3
  - id: arguments
    weight: 0.5
  - id: sentences
    weight: 0
---

# Logical Form

The **logical form** of an argument is its abstract structure: the pattern you get when you replace the specific content with placeholder variables.

Consider this argument:

1. All dogs are mammals.
2. Rex is a dog.
3. $\therefore$ Rex is a mammal.

Replace the specific nouns with variables:

1. All $A$ are $B$.
2. $C$ is an $A$.
3. $\therefore$ $C$ is a $B$.

This pattern is the **logical form**. Any argument that fits this pattern has the same form, regardless of what $A$, $B$, and $C$ stand for.

---

## Worked Example: Extracting Logical Form

**Argument:**

1. All teachers are graduates.
2. Sarah is a teacher.
3. $\therefore$ Sarah is a graduate.

**Steps:**

1. Identify the content words that can be swapped out: "teachers," "graduates," "Sarah."
2. Replace each piece of content with a variable: "teachers" $\to$ $A$, "graduates" $\to$ $B$, "Sarah" $\to$ $C$.
3. Write the pattern:
   - All $A$ are $B$.
   - $C$ is an $A$.
   - $\therefore$ $C$ is a $B$.
4. This is the same form as the dogs/mammals argument above.

---

**Argument:**

1. If it rains, the ground gets wet.
2. It is raining.
3. $\therefore$ The ground gets wet.

**Steps:**

1. Identify the replaceable content: "it rains" and "the ground gets wet."
2. Replace: "it rains" $\to$ $A$, "the ground gets wet" $\to$ $B$.
3. Write the pattern:
   - If $A$, then $B$.
   - $A$.
   - $\therefore$ $B$.
4. This is a different form from the previous example.

---

:::problem{tags="extract-form"}
:::

---

# Same Form, Different Arguments

Two arguments share the same logical form when you can map one onto the other by consistently swapping content words.

Compare these two arguments:

- "All cats are animals. Whiskers is a cat. So Whiskers is an animal."
- "All planets are round. Mars is a planet. So Mars is round."

Both have the form: All $A$ are $B$. $C$ is an $A$. $\therefore$ $C$ is a $B$. _Same form._

Now compare:

- "If it snows, school closes. It snowed. So school closed."
- "All cats are animals. Whiskers is a cat. So Whiskers is an animal."

One is an "if...then" pattern, the other is an "all...are" pattern. _Different forms._

---

## Worked Example: Do These Arguments Share the Same Form?

**Argument 1:**

1. Either the train is late or the schedule changed.
2. The train is not late.
3. $\therefore$ The schedule changed.

**Argument 2:**

1. Either Emily or Mark took the last cookie.
2. Emily did not take the last cookie.
3. $\therefore$ Mark took the last cookie.

**Steps:**

1. Extract the form of Argument 1: Either $A$ or $B$. Not $A$. $\therefore$ $B$.
2. Extract the form of Argument 2: Either $A$ or $B$. Not $A$. $\therefore$ $B$.
3. Both arguments share the pattern: Either $A$ or $B$. Not $A$. $\therefore$ $B$.
4. _Verdict: same form._

---

**Argument 1:**

1. All roses are flowers.
2. This plant is a rose.
3. $\therefore$ This plant is a flower.

**Argument 2:**

1. If the alarm rings, there is a fire.
2. The alarm rings.
3. $\therefore$ There is a fire.

**Steps:**

1. Form of Argument 1: All $A$ are $B$. $C$ is an $A$. $\therefore$ $C$ is a $B$.
2. Form of Argument 2: If $A$, then $B$. $A$. $\therefore$ $B$.
3. These patterns are structurally different: one uses "All...are," the other uses "If...then."
4. _Verdict: different forms._

---

:::problem{tags="same-form"}
:::

---

# Formal Validity

An argument is **formally valid** when _every_ argument with the same logical form is valid. The form alone guarantees the conclusion follows.

An argument is **conceptually valid** when it is valid because of the _meanings_ of specific words, not because of its form.

- _Formally valid:_ Either $A$ or $B$. Not $A$. $\therefore$ $B$. Valid no matter what $A$ and $B$ are.
- _Conceptually valid:_ Alex is a brother. $\therefore$ Alex is a sibling. Valid because "brother" means "male sibling," not because of the form.

To test for formal validity: try plugging in _different_ content. If you can find a substitution that produces an invalid argument, the original was not formally valid.

---

## Worked Example: Formally Valid or Only Conceptually Valid?

**Argument:**

1. Sarah is either an engineer or a teacher.
2. Sarah is not a teacher.
3. $\therefore$ Sarah is an engineer.

**Steps:**

1. Extract the form: Either $A$ or $B$. Not $B$. $\therefore$ $A$.
2. Try any substitution: "Either Emily is a musician or a painter. Emily is not a painter. Therefore, Emily is a musician."
3. That argument is also valid. In fact, _every_ argument of this form is valid.
4. _Verdict: formally valid._ The structure alone guarantees validity.

---

**Argument:**

1. Alex is a brother.
2. $\therefore$ Alex is a sibling.

**Steps:**

1. Extract the form: $A$ is an $X$. $\therefore$ $A$ is a $Y$.
2. Try a different substitution: "Emily is an engineer. Therefore, Emily is a musician."
3. That argument is clearly invalid: being an engineer does not make someone a musician.
4. The original argument is valid only because "brother" means "male sibling." A different substitution breaks it.
5. _Verdict: conceptually valid, not formally valid._ The validity depends on word meanings, not structure.

---

:::problem{tags="formal-vs-conceptual"}
:::
