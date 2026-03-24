---
id: exclusive_or
title: 'Exclusive Or'
prerequisites:
  - id: biconditional
    weight: 0.3
  - id: conditional_unless
    weight: 0.1
  - id: disjunction
    weight: 0.5
  - id: conjunction
    weight: 0.5
  - id: negation
    weight: 0.5
---

# Symbolizing Exclusive Or

You know that TFL's $\lor$ is inclusive: $(P \lor Q)$ is true even when both $P$ and $Q$ are true. There is no single TFL symbol for the exclusive reading. To say "one or the other, but not both," you combine three connectives you already know:

$$(P \lor Q) \land \neg (P \land Q)$$

- $(P \lor Q)$: at least one is true.
- $\neg (P \land Q)$: not both are true.
- The conjunction $\land$ combines both conditions.

---

## Worked Example: Symbolizing exclusive or

**Sentence:** "You get soup or salad, but not both."

**Symbolization key:** $S_1$: You get soup. $S_2$: You get salad.

**Steps:**

1. "Soup or salad" gives the inclusive part: $(S_1 \lor S_2)$.
2. "Not both" means $\neg (S_1 \land S_2)$.
3. "But" is conjunction, joining the two parts.
4. **Answer: $(S_1 \lor S_2) \land \neg (S_1 \land S_2)$**

---

**Sentence:** "Either the door is locked or it is unlocked, but not both."

**Symbolization key:** $L$: The door is locked. $U$: The door is unlocked.

**Steps:**

1. Inclusive disjunction: $(L \lor U)$.
2. Not both: $\neg (L \land U)$.
3. Combine with conjunction.
4. **Answer: $(L \lor U) \land \neg (L \land U)$**

---

:::problem{tags="symbolize-xor"}
:::

---

# Truth Table for Exclusive Or

The exclusive or formula $(P \lor Q) \land \neg (P \land Q)$ produces this truth pattern:

| $P$ | $Q$ | $P \lor Q$ | $P \land Q$ | $\neg (P \land Q)$ | $(P \lor Q) \land \neg (P \land Q)$ |
| --- | --- | ---------- | ----------- | ------------------ | ----------------------------------- |
| T   | T   | T          | T           | F                  | **F**                               |
| T   | F   | T          | F           | T                  | **T**                               |
| F   | T   | T          | F           | T                  | **T**                               |
| F   | F   | F          | F           | T                  | **F**                               |

The result column: true when exactly one of $P$, $Q$ is true; false when both are true or both are false. This matches the meaning of "one or the other, but not both."

---

## Worked Example: Verifying exclusive or with a truth table

**Formula:** $(A \lor B) \land \neg (A \land B)$, with $A$ = T, $B$ = T.

**Steps:**

1. Evaluate $A \lor B$: T $\lor$ T = T.
2. Evaluate $A \land B$: T $\land$ T = T.
3. Negate: $\neg$(T) = F.
4. Combine: T $\land$ F = F.
5. **Result: F.** Both are true, so the exclusive or is false.

---

**Formula:** $(A \lor B) \land \neg (A \land B)$, with $A$ = T, $B$ = F.

**Steps:**

1. Evaluate $A \lor B$: T $\lor$ F = T.
2. Evaluate $A \land B$: T $\land$ F = F.
3. Negate: $\neg$(F) = T.
4. Combine: T $\land$ T = T.
5. **Result: T.** Exactly one is true, so the exclusive or is true.

---

:::problem{tags="xor-truth-table"}
:::
