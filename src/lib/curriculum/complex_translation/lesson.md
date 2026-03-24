---
id: complex_translation
title: 'Complex Translations'
prerequisites:
  - id: exclusive_or
    weight: 0.3
  - id: scope
    weight: 0.7
  - id: conditional_basics
    weight: 0.4
  - id: biconditional
    weight: 0.3
  - id: conditional_only_if
    weight: 0.3
  - id: conditional_unless
    weight: 0.3
  - id: atomic_sentences
    weight: 0.5
---

# Translating Complex English into TFL

Complex English sentences combine multiple connectives. Translating them requires a systematic approach:

1. Set up a symbolization key for each atomic sentence.
2. Identify the main English connective (the one that splits the sentence into its largest parts).
3. Translate each part separately.
4. Combine the parts with the correct TFL connective.
5. Check that brackets reflect the intended scope.

The main English connective determines the main operator of the TFL formula.

---

## Worked Example: English to TFL

**Sentence:** "If the power goes out and the backup fails, then the data is lost."

**Symbolization key:** $P$: The power goes out. $B$: The backup fails. $D$: The data is lost.

**Steps:**

1. Identify the main connective: "If... then...". This splits the sentence into:
   - Antecedent: "the power goes out and the backup fails"
   - Consequent: "the data is lost"
2. Translate the antecedent "the power goes out and the backup fails":
   - Connective: "and" ($\land$).
   - Atomic parts: $P$ (power out), $B$ (backup fails).
   - Symbolized: $(P \land B)$.
3. Translate the consequent "the data is lost":
   - Atomic part: $D$ (data lost).
4. Combine the parts using the main operator ($\to$):
   - $(P \land B) \to D$.
5. **Answer: $(P \land B) \to D$**

---

**Sentence:** "Either the train is late or the schedule changed, but tickets are not refunded."

**Symbolization key:** $L$: The train is late. $S$: The schedule changed. $R$: Tickets are refunded.

**Steps:**

1. Identify the main connective: "but". In logic, "but" functions as a conjunction ($\land$).
   - Left conjunct: "Either the train is late or the schedule changed"
   - Right conjunct: "tickets are not refunded"
2. Translate the left conjunct "Either the train is late or the schedule changed":
   - Connective: "either... or" ($\lor$).
   - Atomic parts: $L$ (train is late), $S$ (schedule changed).
   - Symbolized: $(L \lor S)$.
3. Translate the right conjunct "tickets are not refunded":
   - Connective: "not" ($\neg$).
   - Atomic part: $R$ (tickets refunded).
   - Symbolized: $\neg R$.
4. Combine with the main operator ($\land$):
   - $(L \lor S) \land \neg R$.
5. **Answer: $(L \lor S) \land \neg R$**

---

:::problem{tags="english-to-tfl"}
:::

---

# Translating TFL Back into English

To translate a TFL formula into English, work from the main operator outward:

1. Identify the main operator of the formula.
2. Translate each sub-formula into English.
3. Join them with the English phrase matching the main operator.

The main operator determines the overall sentence structure. Inner sub-formulas become clauses within that structure.

---

## Worked Example: TFL to English

**Formula:** $(R \to (S \land \neg G))$

**Symbolization key:** $R$: It rains. $S$: The streets are wet. $G$: The game is played.

**Steps:**

1. Identify the main operator: $\to$. This formula is a conditional ("If... then").
   - Antecedent: $R$
   - Consequent: $(S \land \neg G)$
2. Translate the antecedent $R$:
   - "It rains."
3. Translate the consequent $(S \land \neg G)$:
   - Main operator: $\land$ ("and").
   - Left side: $S$ ("The streets are wet").
   - Right side: $\neg G$ ("The game is not played").
   - Combined: "the streets are wet and the game is not played."
4. Assemble using the main "If... then" structure:
   - "If it rains, then the streets are wet and the game is not played."
5. **Answer: "If it rains, then the streets are wet and the game is not played."**

---

**Formula:** $\neg (P \lor Q) \leftrightarrow (R \to S)$

**Symbolization key:** $P$: Alice is home. $Q$: Bob is home. $R$: The door is locked. $S$: The alarm is set.

**Steps:**

1. Identify the main operator: $\leftrightarrow$. This is a biconditional ("if and only if").
   - Left side: $\neg (P \lor Q)$
   - Right side: $(R \to S)$
2. Translate the left side $\neg (P \lor Q)$:
   - Main operator: $\neg$ ("It is not the case that...").
   - Inner part: $(P \lor Q)$ ("Alice is home or Bob is home").
   - Combined: "Neither Alice nor Bob is home."
3. Translate the right side $(R \to S)$:
   - Main operator: $\to$ ("If... then").
   - Antecedent: $R$ ("the door is locked").
   - Consequent: $S$ ("the alarm is set").
   - Combined: "if the door is locked, then the alarm is set."
4. Assemble using the "if and only if" connective:
   - "Neither Alice nor Bob is home if and only if, if the door is locked, then the alarm is set."
5. **Answer: "Neither Alice nor Bob is home if and only if the door being locked means the alarm is set."**

---

:::problem{tags="tfl-to-english"}
:::

---

# Nested Connectives: Three or More Operators

Sentences with three or more operators require careful attention to scope and bracketing. The procedure is the same: find the main connective, split, translate each part, and combine. Repeat recursively for sub-formulas.

---

## Worked Example: Translating deeply nested sentences

**Sentence:** "If it is not the case that both Alice and Bob attend, then either the meeting is canceled or it is rescheduled."

**Symbolization key:** $A$: Alice attends. $B$: Bob attends. $C$: The meeting is canceled. $R$: The meeting is rescheduled.

**Steps:**

1. Identify the main connective: "If... then...". This is a conditional ($\to$).
   - Antecedent: "it is not the case that both Alice and Bob attend"
   - Consequent: "either the meeting is canceled or it is rescheduled"
2. Translate the antecedent "it is not the case that both Alice and Bob attend":
   - Connective: "it is not the case that" ($\neg$).
   - Inner clause: "both Alice and Bob attend" $\rightarrow$ $(A \land B)$.
   - Symbolized: $\neg (A \land B)$.
3. Translate the consequent "either the meeting is canceled or it is rescheduled":
   - Connective: "either... or" ($\lor$).
   - Atomic parts: $C$ (canceled), $R$ (rescheduled).
   - Symbolized: $(C \lor R)$.
4. Combine into final TFL formula:
   - $\neg (A \land B) \to (C \lor R)$.
5. **Answer: $\neg (A \land B) \to (C \lor R)$**

---

**Sentence:** "The alarm triggers if and only if the door is open and it is not the case that the code was entered."

**Symbolization key:** $A$: The alarm triggers. $D$: The door is open. $C$: The code was entered.

**Steps:**

1. Identify the main connective: "if and only if". This is a biconditional ($\leftrightarrow$).
   - Left side: "The alarm triggers"
   - Right side: "the door is open and it is not the case that the code was entered"
2. Translate the left side:
   - Atomic part: $A$ (alarm triggers).
3. Translate the right side "the door is open and it is not the case that the code was entered":
   - Connective: "and" ($\land$).
   - Left conjunct: "the door is open" $\rightarrow$ $D$.
   - Right conjunct: "it is not the case that the code was entered" $\rightarrow$ $\neg C$.
   - Symbolized: $(D \land \neg C)$.
4. Combine into final TFL formula:
   - $A \leftrightarrow (D \land \neg C)$.
5. **Answer: $A \leftrightarrow (D \land \neg C)$**

---

:::problem{tags="nested-translation"}
:::
