---
id: biconditional
title: 'The Biconditional'
prerequisites:
  - id: conditional_basics
    weight: 0.7
  - id: scope
    weight: 0.3
---

# The Biconditional: If and Only If

The biconditional connects two sentences with "if and only if." In TFL, we write it with the symbol $\leftrightarrow$.

$(P \leftrightarrow Q)$ means "$P$ if and only if $Q$": $P$ and $Q$ are either both true or both false.

---

## Worked Example: Translating "if and only if"

**Sentence:** "The alarm sounds if and only if there is smoke."

**Symbolization key:** $A$: The alarm sounds. $S$: There is smoke.

**Steps:**

1. "If and only if" signals a biconditional.
2. Left side: "the alarm sounds" = $A$.
3. Right side: "there is smoke" = $S$.
4. **Answer: $(A \leftrightarrow S)$**

---

**Sentence:** "You pass the course if and only if you pass the final exam."

**Symbolization key:** $C$: You pass the course. $E$: You pass the final exam.

**Steps:**

1. "If and only if" signals a biconditional.
2. Left side: $C$. Right side: $E$.
3. **Answer: $(C \leftrightarrow E)$**

---

:::problem{tags="translate-biconditional"}
:::

---

# Other English Phrases for the Biconditional

Several English phrases express the biconditional:

- "P if and only if Q" translates to $(P \leftrightarrow Q)$
- "P just in case Q" translates to $(P \leftrightarrow Q)$
- "P exactly when Q" translates to $(P \leftrightarrow Q)$
- "P iff Q" translates to $(P \leftrightarrow Q)$

The abbreviation "iff" (two f's) is the standard shorthand for "if and only if." Do not confuse "iff" with "if" (one f).

---

## Worked Example: Translating biconditional phrases

**Sentence:** "The light is on just in case the switch is flipped."

**Symbolization key:** $L$: The light is on. $S$: The switch is flipped.

**Steps:**

1. "Just in case" signals a biconditional.
2. Left side: $L$. Right side: $S$.
3. **Answer: $(L \leftrightarrow S)$**

---

**Sentence:** "The door opens exactly when you scan your badge."

**Symbolization key:** $D$: The door opens. $B$: You scan your badge.

**Steps:**

1. "Exactly when" signals a biconditional.
2. Left side: $D$. Right side: $B$.
3. **Answer: $(D \leftrightarrow B)$**

---

:::problem{tags="biconditional-phrases"}
:::

---

# Computing Truth Values for the Biconditional

The biconditional is true when both sides have the **same** truth value. It is false when the two sides differ.

| $P$ | $Q$ | $P \leftrightarrow Q$ |
| --- | --- | --------------------- |
| T   | T   | **T**                 |
| T   | F   | **F**                 |
| F   | T   | **F**                 |
| F   | F   | **T**                 |

---

## Worked Example: Computing biconditional truth values

**Problem:** Suppose $P$ is true and $Q$ is true. What is the truth value of $(P \leftrightarrow Q)$?

**Steps:**

1. $P$ is true, $Q$ is true.
2. Same truth values: the biconditional is true.
3. **$(P \leftrightarrow Q)$ is true.**

---

**Problem:** Suppose $A$ is true and $B$ is false. What is the truth value of $(A \leftrightarrow B)$?

**Steps:**

1. $A$ is true, $B$ is false.
2. Different truth values: the biconditional is false.
3. **$(A \leftrightarrow B)$ is false.**

---

**Problem:** Suppose $R$ is false and $S$ is false. What is the truth value of $(R \leftrightarrow S)$?

**Steps:**

1. $R$ is false, $S$ is false.
2. Same truth values: the biconditional is true.
3. **$(R \leftrightarrow S)$ is true.**

---

:::problem{tags="compute-biconditional"}
:::

---

# The Biconditional as a Double Conditional

The biconditional $(P \leftrightarrow Q)$ is logically equivalent to $(P \to Q) \land (Q \to P)$: the conditional in **both** directions. This is where the name "bi-conditional" comes from.

$(P \to Q)$ says "if $P$ then $Q$." $(Q \to P)$ says "if $Q$ then $P$." Together, they say $P$ and $Q$ always share the same truth value, which is exactly what $\leftrightarrow$ expresses.

---

## Worked Example: Why the biconditional equals two conditionals

**Problem:** Show that $(P \leftrightarrow Q)$ and $(P \to Q) \land (Q \to P)$ agree when $P$ is true and $Q$ is false.

**Steps:**

1. $(P \leftrightarrow Q)$: different truth values, so the biconditional is **false**.
2. $(P \to Q)$: T $\to$ F = **F**.
3. $(Q \to P)$: F $\to$ T = **T**.
4. $(P \to Q) \land (Q \to P)$: F $\land$ T = **F**.
5. Both formulas give false. They agree.

---

**Problem:** Show that $(P \leftrightarrow Q)$ and $(P \to Q) \land (Q \to P)$ agree when $P$ is false and $Q$ is false.

**Steps:**

1. $(P \leftrightarrow Q)$: same truth values, so the biconditional is **true**.
2. $(P \to Q)$: F $\to$ F = **T** (vacuous truth).
3. $(Q \to P)$: F $\to$ F = **T** (vacuous truth).
4. $(P \to Q) \land (Q \to P)$: T $\land$ T = **T**.
5. Both formulas give true. They agree.

---

:::problem{tags="double-conditional"}
:::
