---
id: truth_functions_intro
title: 'Truth-Functional Connectives'
prerequisites:
  - id: atomic_sentences
    weight: 0.3
---

# What Makes a Connective Truth-Functional?

A connective is **truth-functional** when the truth value of the compound sentence it builds depends _only_ on the truth values of the parts.

If you know whether each part is true or false, you can determine whether the whole compound is true or false. You do not need any other information: no context, no background knowledge.

**Example:** "and" is truth-functional. "The sky is blue _and_ grass is green" is true exactly when both parts are true. It does not matter _what_ those parts say. Any two true sentences joined by "and" give a true result. Any pair where at least one is false gives a false result.

The formal language built from these connectives is called **truth-functional logic**, or **TFL** for short. Over the next several lessons, you will learn each TFL connective and its precise truth rule.

---

## Worked Example: Is the connective truth-functional?

**Connective:** "and" (as in "A and B")

**Steps:**

1. Ask: does the truth value of "A and B" depend only on the truth values of A and B?
2. If A is true and B is true, "A and B" is true.
3. If either A or B is false, "A and B" is false.
4. It does not matter what A and B say, only whether they are true or false.
5. **Verdict: "and" is truth-functional.**

---

**Connective:** "because" (as in "A because B")

**Steps:**

1. Ask: does the truth value of "A because B" depend only on the truth values of A and B?
2. Consider two cases where both A and B are true:
   - "The streets are wet because it rained." (True: rain does cause wet streets.)
   - "The streets are wet because Paris is in France." (False: Paris being in France does not cause wet streets.)
3. Both A and B are true in each case, yet one "because" sentence is true and the other is false.
4. The truth value depends on more than just the truth values of the parts; it depends on the specific **relation** between A and B (i.e., whether B actually _causes_ or _explains_ A).
5. **Verdict: "because" is NOT truth-functional.**

---

:::problem{tags="is-truth-functional"}
:::

---

# Characteristic Truth Tables

Every truth-functional connective can be completely described by a **characteristic truth table**: a table that lists every possible combination of input truth values and shows the output for each.

Here is the characteristic truth table for a mystery connective $\star$:

| $P$ | $Q$ | $P \star Q$ |
| --- | --- | ----------- |
| T   | T   | T           |
| T   | F   | F           |
| F   | T   | F           |
| F   | F   | F           |

This table tells you everything about $\star$. The output is true only when both inputs are true. That single condition completely defines the connective.

Reading a truth table is like reading a lookup table: find the row matching your input values, then read off the output.

---

## Worked Example: Reading a characteristic truth table

**Question:** Using the truth table for $\star$, what is the truth value of $P \star Q$ when $P$ is false and $Q$ is true?

| $P$ | $Q$ | $P \star Q$ |
| --- | --- | ----------- |
| T   | T   | T           |
| T   | F   | F           |
| F   | T   | F           |
| F   | F   | F           |

**Steps:**

1. Find the row where $P$ is F and $Q$ is T. That is row 3.
2. Read the output column: F.
3. **Answer: $P \star Q$ is false.**

---

**Question:** A connective $\diamond$ has this truth table:

| $P$ | $Q$ | $P \diamond Q$ |
| --- | --- | -------------- |
| T   | T   | T              |
| T   | F   | T              |
| F   | T   | T              |
| F   | F   | F              |

Under what condition is $P \diamond Q$ false?

**Steps:**

1. Scan the output column for F. It appears only in the last row.
2. In that row, $P$ is F and $Q$ is F.
3. **Answer: $P \diamond Q$ is false only when both $P$ and $Q$ are false.**

---

:::problem{tags="read-truth-table"}
:::

---

# Non-Truth-Functional Expressions

A connective is **not** truth-functional if knowing the truth value of the parts is not enough to determine the truth value of the whole. Some connectives care about the meaning or logic behind a sentence, not just its "True" or "False" label.

**Example: "It is necessarily true that..."**

To see why this fails, compare two sentences that are both **True**:

- **Sentence A:** "1 + 1 = 2" (True)
- **Sentence B:** "Paris is the capital of France" (True)

Now, let's plug them into the connective:

- "It is necessarily true that **1 + 1 = 2**" $\rightarrow$ **True**. This is a mathematical fact that could never be otherwise.
- "It is necessarily true that **Paris is the capital of France**" $\rightarrow$ **False**. While this is currently true, it is not necessary. The French government could decide to move the capital to a different city tomorrow.

**The Result:** Even though both inputs were **True**, the outputs were different. This proves the connective "necessarily" looks at the reason why a sentence is true instead of just looking at the truth value itself.

**The Key Test:** If you can find two sentences with the same truth value (both True or both False) that produce different results when plugged into the connective, the connective is **not truth-functional**.

---

## Worked Example: Is it truth-functional?

**Expression:** "It is possible that A"

**Steps:**

1. Consider two false sentences:
   - "Humans can breathe underwater without equipment" (false)
   - "$2 + 2 = 5$" (false)
2. "It is possible that humans can breathe underwater without equipment": false in reality, but we could imagine future technology making it true. This is at least arguably possible.
3. "It is possible that $2 + 2 = 5$": this is false in every possible scenario. Mathematical facts cannot change.
4. Both input sentences are false, but the "it is possible that..." outputs differ.
5. **Verdict: "It is possible that..." is NOT truth-functional.**

---

**Expression:** "not" (as in "It is not the case that A")

**Steps:**

1. If A is true, "not A" is false. Always.
2. If A is false, "not A" is true. Always.
3. Every true sentence, when negated, gives false. Every false sentence, when negated, gives true.
4. There is no pair of sentences with the same truth value that produce different results under "not."
5. **Verdict: "not" IS truth-functional.**

---

:::problem{tags="not-truth-functional"}
:::
