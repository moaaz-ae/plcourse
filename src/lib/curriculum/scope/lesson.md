---
id: scope
title: 'Scope of Connectives'
prerequisites:
  - id: main_operator
    weight: 0.8
---

# What Scope Means

The **scope** of a connective is the sub-formula that it governs. For every connective in a formula, its scope is the smallest complete sub-formula in which that connective is the main operator.

Consider $(P \land \neg Q)$:

- The scope of $\land$ is the entire formula $(P \land \neg Q)$, because $\land$ is the main operator of the whole formula.
- The scope of $\neg$ is $\neg Q$, because $\neg$ is the main operator of just that sub-formula.

---

## Worked Example: Finding the scope of each connective

**Formula:** $(\neg A \land (B \lor C))$

**Steps:**

1. Identify every connective: $\neg$, $\land$, $\lor$.
2. The scope of $\neg$ is $\neg A$. It governs only $A$.
3. The scope of $\lor$ is $(B \lor C)$. It governs $B$ and $C$.
4. The scope of $\land$ is $(\neg A \land (B \lor C))$. It governs the whole formula.

---

**Formula:** $\neg (P \land \neg Q)$

**Steps:**

1. Connectives: the outer $\neg$, $\land$, and the inner $\neg$.
2. The scope of the inner $\neg$ is $\neg Q$.
3. The scope of $\land$ is $(P \land \neg Q)$.
4. The scope of the outer $\neg$ is $\neg (P \land \neg Q)$ (the whole formula).

---

:::problem{tags="find-scope"}
:::

---

# When Brackets Change Meaning

Brackets determine scope. Moving or removing brackets can change which connective governs which parts, producing a different formula with different truth values.

Compare these two formulas:

- $\neg (A \land B)$: the $\neg$ governs the entire conjunction. "It is not the case that both $A$ and $B$ are true."
- $(\neg A \land B)$: the $\neg$ governs only $A$. "Not-$A$, and $B$."

These are different formulas with different truth values.

---

## Worked Example: Do bracket changes alter meaning?

**Question:** Does $(A \lor B) \land C$ mean the same as $A \lor (B \land C)$?

**Steps:**

1. In $(A \lor B) \land C$, the main operator is $\land$. The scope of $\lor$ is $(A \lor B)$.
2. In $A \lor (B \land C)$, the main operator is $\lor$. The scope of $\land$ is $(B \land C)$.
3. The main operators differ, so the formulas have different structures.
4. Test with $A$ = T, $B$ = F, $C$ = F:
   - $(A \lor B) \land C = T \land F = F$.
   - $A \lor (B \land C) = T \lor F = T$.
5. **The bracket change alters the meaning.**

---

**Question:** Does $\neg \neg P$ mean the same as $\neg (\neg P)$?

**Steps:**

1. $\neg \neg P$: the outer $\neg$ applies to $\neg P$. The inner $\neg$ applies to $P$.
2. $\neg (\neg P)$: the outer $\neg$ applies to $(\neg P)$, which is $\neg P$.
3. These are the same formula. Adding brackets around $\neg P$ does not change what $\neg$ governs, because negation (rule 2) does not use brackets.
4. **No change in meaning.**

---

:::problem{tags="brackets-change-meaning"}
:::
