---
id: wff_basics
title: 'Well-Formed Formulas'
prerequisites:
  - id: negation
    weight: 0.3
  - id: conjunction
    weight: 0.3
  - id: disjunction
    weight: 0.3
---

# The Grammar of TFL

TFL has a precise grammar that defines which strings of symbols count as sentences. A string that follows these rules is called a **well-formed formula** (WFF). A string that breaks them is not a sentence at all.

The rules are recursive. They start from a base case and build upward:

1. Every sentence letter is a WFF. ($A$, $B$, $P$, $Q$, etc.)
2. If $\mathcal{A}$ is a WFF, then $\neg \mathcal{A}$ is a WFF.
3. If $\mathcal{A}$ and $\mathcal{B}$ are WFFs, then $(\mathcal{A} \land \mathcal{B})$ is a WFF.
4. If $\mathcal{A}$ and $\mathcal{B}$ are WFFs, then $(\mathcal{A} \lor \mathcal{B})$ is a WFF.
5. Nothing else is a WFF using the connectives introduced so far (we'll add more in later lessons).

---

## Worked Example: Checking whether a string is a WFF

**String:** $(P \land Q)$

**Steps:**

1. $P$ is a sentence letter, so $P$ is a WFF (rule 1).
2. $Q$ is a sentence letter, so $Q$ is a WFF (rule 1).
3. Since $P$ and $Q$ are both WFFs, $(P \land Q)$ is a WFF (rule 3).
4. **$(P \land Q)$ is a WFF.**

---

**String:** $\neg (A \lor B)$

**Steps:**

1. $A$ is a WFF (rule 1). $B$ is a WFF (rule 1).
2. Since $A$ and $B$ are WFFs, $(A \lor B)$ is a WFF (rule 4).
3. Since $(A \lor B)$ is a WFF, $\neg (A \lor B)$ is a WFF (rule 2).
4. **$\neg (A \lor B)$ is a WFF.**

---

**String:** $A \neg B$

**Steps:**

1. $A$ and $B$ are WFFs (rule 1).
2. Rule 2 states that the negation symbol $\neg$ must be placed in front of a WFF. While $\neg B$ is a WFF, the string still has $A$ sitting next to it with no connective between them.
3. Rules 3 and 4 require a conjunction ($\land$) or disjunction ($\lor$) to join two WFFs together.
4. The symbol $\neg$ cannot be used to join $A$ and $B$ together in this way.
5. **$A \neg B$ is not a WFF.**

---

:::problem{tags="is-wff"}
:::

---

# Why Some Strings Fail

A string fails to be a WFF when it violates the formation rules. Common violations:

- **Missing operand:** $\neg \land P$ fails because $\land$ requires a WFF on each side, and $\neg$ alone is not a WFF.
- **Adjacent connectives:** $P \land \lor Q$ fails because $\land$ needs a WFF on its right, and $\lor Q$ is not a WFF.
- **Unmatched brackets:** $(P \land Q$ fails because the opening bracket has no closing bracket.
- **Bare connective:** $\land$ by itself is not a sentence letter, so it is not a WFF by rule 1, and no other rule applies.

Every violation traces back to the same thing: at some step, no rule can apply.

---

## Worked Example: Identifying why a string is not a WFF

**String:** $P \land \lor Q$

**Steps:**

1. $P$ is a WFF (rule 1). $Q$ is a WFF (rule 1).
2. To form a conjunction with $\land$, we need a WFF on each side.
3. The right side of $\land$ here starts with $\lor$, a connective. $\lor Q$ is not a WFF: $\lor$ needs a WFF on its left, and there is nothing there.
4. Since the right side of $\land$ is not a WFF, the whole string fails rule 3.
5. **$P \land \lor Q$ is not a WFF.** The violation: adjacent connectives with no operand between them.

---

**String:** $\neg \land A$

**Steps:**

1. $A$ is a WFF (rule 1).
2. Rule 2 says: if $\mathcal{A}$ is a WFF, then $\neg \mathcal{A}$ is a WFF. So $\neg$ must be followed by a WFF.
3. $\land A$ is not a WFF. The $\land$ connective requires a WFF on its left, but there is nothing there.
4. Since $\land A$ is not a WFF, $\neg \land A$ fails rule 2.
5. **$\neg \land A$ is not a WFF.** The violation: $\neg$ is followed by a connective, not a WFF.

---

:::problem{tags="not-wff"}
:::

---

# Building WFFs Step by Step

Complex WFFs are built from simpler ones. Start with sentence letters and apply the rules one at a time.

To construct a formula like $\neg (P \land \neg Q)$:

1. Start with $Q$ (WFF by rule 1).
2. Apply negation: $\neg Q$ (WFF by rule 2).
3. Start with $P$ (WFF by rule 1).
4. Combine with conjunction: $(P \land \neg Q)$ (WFF by rule 3).
5. Apply negation: $\neg (P \land \neg Q)$ (WFF by rule 2).

Each step uses exactly one rule. The result is guaranteed to be a WFF because every step is valid.

---

## Worked Example: Building a WFF from a description

**Task:** Build a WFF that says "either $A$ or not $B$."

**Steps:**

1. $B$ is a WFF (rule 1).
2. $\neg B$ is a WFF (rule 2).
3. $A$ is a WFF (rule 1).
4. $(A \lor \neg B)$ is a WFF (rule 4): it combines two WFFs with $\lor$.
5. **Answer: $(A \lor \neg B)$**

---

**Task:** Build a WFF that says "not both $P$ and $Q$."

**Steps:**

1. $P$ is a WFF (rule 1). $Q$ is a WFF (rule 1).
2. $(P \land Q)$ is a WFF (rule 3).
3. $\neg (P \land Q)$ is a WFF (rule 2).
4. **Answer: $\neg (P \land Q)$**

---

:::problem{tags="build-wff"}
:::
