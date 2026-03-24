---
id: atomic_sentences
title: 'Atomic Sentences and Symbolization Keys'
prerequisites:
  - id: logical_form
    weight: 0.3
  - id: sentences
    weight: 0.3
---

# Sentence Letters and Symbolization Keys

In formal logic, we use single uppercase letters to stand in for simple English sentences. These are called **sentence letters**.

| Sentence letter | English sentence             |
| --------------- | ---------------------------- |
| $P$             | It is raining.               |
| $Q$             | The ground is wet.           |
| $R$             | The match has been canceled. |

Each letter is an **atomic sentence**: a basic building block that cannot be broken down further in the formal language. Whatever internal structure the English sentence has (subjects, verbs, adjectives) is lost once we assign it a letter. In formal logic, $P$ is just $P$.

We are not "translating" English into logic. We are **symbolizing**: assigning a sentence letter the same truth value as the English sentence it represents.

The list that records each assignment is called a **symbolization key**. It maps each sentence letter to the English sentence it represents. Without the key, the letters are meaningless.

A symbolization key is always local: it applies to the current argument. A different argument can reuse the same letters with different meanings by providing a new key.

---

## Worked Example: Creating a Symbolization Key

**Passage:** "If the museum is open, visitors can enter. The museum is open on weekdays. Today is a weekday."

**Steps:**

1. Identify each distinct simple claim:
   - "The museum is open"
   - "Visitors can enter"
   - "Today is a weekday"
2. Each sentence is a simple, declarative statement that can be true or false. Each one gets its own letter.
3. Assign a letter to each and write the symbolization key:

| Letter | English sentence    |
| ------ | ------------------- |
| $M$    | The museum is open. |
| $V$    | Visitors can enter. |
| $W$    | Today is a weekday. |

These three letters are now our atomic sentences. They represent the truth values of the English originals.

---

**English sentences:**

- "Sarah passed the exam."
- "Sarah is happy."

**Steps:**

1. These are two different claims about Sarah. Even though they share a subject, they are independent statements.
2. Assign a letter to each:
   - $P$: Sarah passed the exam.
   - $H$: Sarah is happy.
3. Do not try to use $P$ for both. Each distinct claim gets its own letter and its own entry in the symbolization key.

---

:::problem{tags="assign-letters,create-key"}
:::

---

# Identifying Atomic Sentences

Complex English sentences often contain multiple atomic sentences joined by words like "and," "or," "if," and "not." To symbolize such sentences, first identify the **atomic parts**: the simplest claims that cannot be broken down further.

| Complex sentence                                       | Atomic parts                                   |
| ------------------------------------------------------ | ---------------------------------------------- |
| "It is raining and the ground is wet."                 | "It is raining," "The ground is wet"           |
| "If the alarm sounds, we evacuate."                    | "The alarm sounds," "We evacuate"              |
| "Either the battery is dead or the charger is broken." | "The battery is dead," "The charger is broken" |
| "The door is not locked."                              | "The door is locked"                           |

Words like "and," "or," "if...then," and "not" are connectives. They join atomic sentences together but are not atomic sentences themselves.

---

## Worked Example: Finding the Atomic Sentences

**Sentence:** "If the store is closed, we will go to the park, and we will have a picnic."

**Steps:**

1. Look for the connective words: "if...then" and "and."
2. These connectives join simpler claims. Identify each:
   - "The store is closed"
   - "We will go to the park"
   - "We will have a picnic"
3. These three are the atomic sentences. None of them can be broken down further into logical parts.

---

**Sentence:** "The suspect did not flee, but a witness saw the crime."

**Steps:**

1. Connective words: "not" and "but" ("but" functions like "and").
2. Identify the atomic parts:
   - "The suspect fled" (the base claim, modified by "not")
   - "A witness saw the crime"
3. There are two atomic sentences. "Not" modifies the first one; "but" joins the two.

---

:::problem{tags="identify-atomic"}
:::
