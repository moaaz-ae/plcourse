---
id: truth_table_setup
title: 'Truth Table Setup & 2^n Rule'
prerequisites:
  - id: complex_translation
    weight: 0.1
---

# The $2^n$ Rule

A truth table lists every possible combination of truth values for the sentence letters in a formula. The number of rows depends on the number of distinct sentence letters.

**The rule:** if a formula contains $n$ distinct sentence letters, the truth table has $2^n$ rows.

- 1 sentence letter: $2^1 = 2$ rows
- 2 sentence letters: $2^2 = 4$ rows
- 3 sentence letters: $2^3 = 8$ rows
- 4 sentence letters: $2^4 = 16$ rows

Each row represents one **valuation**: a specific assignment of T or F to every sentence letter.

---

## Worked Example: Counting rows

**Formula:** $(P \land Q) \to R$

**Steps:**

1. Identify distinct sentence letters: $P$, $Q$, $R$. That is 3 letters.
2. Apply the rule: $2^3 = 8$.
3. **The truth table has 8 rows.**

---

**Formula:** $\neg (A \lor A)$

**Steps:**

1. Identify distinct sentence letters: $A$. Only 1 letter (even though $A$ appears twice).
2. Apply the rule: $2^1 = 2$.
3. **The truth table has 2 rows.**

---

:::problem{tags="count-rows"}
:::

---

# The Halving Method for Reference Columns

The reference columns are the leftmost columns of the truth table, one for each sentence letter. They list every possible combination of T and F systematically.

**The halving method:**

1. List the sentence letters in alphabetical order from left to right.
2. For the **rightmost** letter: alternate T and F (T, F, T, F, ...).
3. For the **next letter to the left**: write two T's, then two F's, then repeat (TT, FF, TT, FF, ...).
4. For the **next letter**: write four T's, then four F's, and repeat.
5. Continue, doubling the block size each time you move left.

For 2 sentence letters ($P$, $Q$) with 4 rows:

| $P$ | $Q$ |
| --- | --- |
| T   | T   |
| T   | F   |
| F   | T   |
| F   | F   |

$P$ (left column): 2 T's, then 2 F's. $Q$ (right column): alternate T, F.

For 3 sentence letters ($A$, $B$, $C$) with 8 rows:

| $A$ | $B$ | $C$ |
| --- | --- | --- |
| T   | T   | T   |
| T   | T   | F   |
| T   | F   | T   |
| T   | F   | F   |
| F   | T   | T   |
| F   | T   | F   |
| F   | F   | T   |
| F   | F   | F   |

$A$: 4 T's, then 4 F's. $B$: 2 T's, 2 F's, 2 T's, 2 F's. $C$: alternate T, F.

---

## Worked Example: Setting up reference columns

**Formula:** $(P \to Q) \land R$

**Steps:**

1. Sentence letters: $P$, $Q$, $R$ (3 letters, so 8 rows).
2. $R$ (rightmost): alternate T, F.
3. $Q$ (middle): blocks of 2.
4. $P$ (leftmost): blocks of 4.

| $P$ | $Q$ | $R$ |
| --- | --- | --- |
| T   | T   | T   |
| T   | T   | F   |
| T   | F   | T   |
| T   | F   | F   |
| F   | T   | T   |
| F   | T   | F   |
| F   | F   | T   |
| F   | F   | F   |

**Reference columns are complete.** No evaluation yet; the setup is done.

---

## Worked Example: A two-variable setup

**Formula:** $A \leftrightarrow \neg B$

**Steps:**

1. Sentence letters: $A$, $B$ (2 letters, so 4 rows).
2. $B$ (rightmost): alternate T, F.
3. $A$ (leftmost): blocks of 2.

| $A$ | $B$ |
| --- | --- |
| T   | T   |
| T   | F   |
| F   | T   |
| F   | F   |

**Setup complete.**

---

:::problem{tags="setup-reference-columns"}
:::
