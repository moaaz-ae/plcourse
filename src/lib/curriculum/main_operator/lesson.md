---
id: main_operator
title: 'Main Operator & Bracket Conventions'
prerequisites:
  - id: wff_basics
    weight: 0.7
---

# The Main Operator

Every WFF (other than a single sentence letter) was built by applying one connective last. That connective is the **main operator**. It governs the entire formula.

Finding the main operator:

- If the formula starts with $\neg$ (and the $\neg$ is not inside any brackets), then $\neg$ is the main operator.
- Otherwise, find the connective whose left and right operands together span the entire formula. That is the main operator.

---

## Worked Example: Identifying the main operator

**Formula:** $(\neg A \land B)$

**Steps:**

1. The outermost structure is $( \_ \land \_ )$, with $\neg A$ on the left and $B$ on the right.
2. The connective joining these two parts is $\land$.
3. The $\neg$ only governs $A$, not the whole formula.
4. **Main operator: $\land$.**

---

**Formula:** $\neg (P \lor Q)$

**Steps:**

1. The formula starts with $\neg$.
2. The $\neg$ applies to $(P \lor Q)$, which is the entire rest of the formula.
3. The $\lor$ is inside the brackets governed by $\neg$, so $\lor$ is not the main operator.
4. **Main operator: $\neg$.**

---

**Formula:** $((A \lor B) \land (C \lor A))$

**Steps:**

1. Strip the outer brackets: the structure is $( \_ \land \_ )$.
2. The left operand is $(A \lor B)$. The right operand is $(C \lor A)$.
3. The connective joining these two sub-formulas is $\land$.
4. **Main operator: $\land$.**

---

:::problem{tags="identify-main-op"}
:::

---

# Bracket Conventions

Strictly, every binary connective requires brackets: $(P \land Q)$, not $P \land Q$. In practice, two conventions make formulas easier to read.

**Convention 1: Drop outermost brackets.** You may write $P \land Q$ instead of $(P \land Q)$ when the formula stands on its own. When you embed it inside a larger formula, the brackets come back:

- Standalone: $P \land Q$ (acceptable shorthand for $(P \land Q)$)
- Embedded: $\neg (P \land Q)$ (brackets required to show $\neg$ applies to the whole conjunction)

**Convention 2: Use square brackets for readability.** $[P \lor Q]$ means the same thing as $(P \lor Q)$. Square brackets are just a visual aid.

These conventions do not change any formula's meaning. They are shortcuts for writing and reading. When checking whether a formula is a WFF, always mentally restore the full brackets.

---

## Worked Example: Rewriting with and without relaxed brackets

**Formula (strict):** $((A \lor B) \land \neg C)$

**Steps:**

1. The outermost brackets wrap the entire formula.
2. Convention 1 allows dropping them: $(A \lor B) \land \neg C$.
3. Convention 2 optionally replaces inner brackets: $[A \lor B] \land \neg C$.
4. **Relaxed form: $(A \lor B) \land \neg C$**

---

**Formula (relaxed):** $P \lor \neg Q$

**Steps:**

1. This stands alone, so outermost brackets were dropped.
2. Restore them: $(P \lor \neg Q)$.
3. **Strict form: $(P \lor \neg Q)$**

---

:::problem{tags="bracket-conventions"}
:::
