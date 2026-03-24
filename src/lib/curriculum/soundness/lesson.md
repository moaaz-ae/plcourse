---
id: soundness
title: 'Soundness'
prerequisites:
  - id: validity
    weight: 0.7
  - id: arguments
    weight: 0.3
  - id: sentences
    weight: 0.1
---

# Sound Arguments

A **sound** argument meets two conditions:

1. It is **valid** (the conclusion follows from the premises).
2. All of its premises are **actually true**.

Validity asks: could the premises be true while the conclusion is false? Soundness adds: are the premises _actually_ true in the real world?

If both conditions hold, the argument is sound and the conclusion is **guaranteed to be true**.

---

## Worked Example: Is the argument sound?

**Argument:**

1. All humans need water.
2. Sarah is a human.
3. $\therefore$ Sarah needs water.

**Steps:**

1. **Check validity:** If all humans need water and Sarah is a human, then Sarah must need water. The conclusion follows. Valid.
2. **Check premises:** Premise 1: all humans need water. True. Premise 2: Sarah is a human. True.
3. Both conditions met.
4. **Verdict: sound.** The conclusion is guaranteed to be true.

---

**Argument:**

1. All birds can fly.
2. Penguins are birds.
3. $\therefore$ Penguins can fly.

**Steps:**

1. **Check validity:** If all birds can fly and penguins are birds, then penguins can fly. The conclusion follows. Valid.
2. **Check premises:** Premise 1: all birds can fly. **False** (penguins, ostriches, and other birds cannot fly). Premise 2: penguins are birds. True.
3. The argument is valid but has a false premise.
4. **Verdict: not sound.** The argument fails because Premise 1 is false.

---

:::problem{tags="evaluate-soundness"}
:::

---

# Valid but Unsound

An argument that is valid but **not** sound always has at least one false premise. The logic is watertight, but it starts from a bad foundation.

|                                    | Valid? | All premises true? | Sound?  |
| ---------------------------------- | ------ | ------------------ | ------- |
| Valid + all true premises          | Yes    | Yes                | **Yes** |
| Valid + at least one false premise | Yes    | No                 | **No**  |
| Invalid (any premises)             | No     | (irrelevant)       | **No**  |

A valid argument with a false premise is called **valid but unsound**. The logical structure works, but because the starting point is wrong, the conclusion is not guaranteed to be true.

---

## Worked Example: Valid but Unsound

**Argument:**

1. All presidents of the United States have been women.
2. Abraham Lincoln was a president of the United States.
3. $\therefore$ Abraham Lincoln was a woman.

**Steps:**

1. **Check validity:** If all US presidents were women and Lincoln was a US president, then Lincoln was a woman. The conclusion follows. Valid.
2. **Identify the false premise:** Premise 1 is false: not all US presidents have been women.
3. Premise 2 is true: Lincoln was a US president.
4. **Verdict: valid but unsound.** The false premise is Premise 1.

---

:::problem{tags="valid-unsound"}
:::

---

# Soundness Guarantees Truth

A sound argument **must** have a true conclusion.

Why? A sound argument must be valid, so whenever all premises are true, the conclusion must be true. A sound argument also has all true premises. Put these together: the premises are true, and validity guarantees the conclusion follows. So the conclusion is true.

If someone presents a sound argument for a claim, the claim is true.

---

## Worked Example: Why the Conclusion Must Be True

**Argument:**

1. All humans are mortal.
2. Socrates is a human.
3. $\therefore$ Socrates is mortal.

**Steps:**

1. The argument is valid: if all humans are mortal and Socrates is a human, Socrates must be mortal.
2. Premise 1 is true: all humans are mortal.
3. Premise 2 is true: Socrates is a human.
4. The argument is sound (valid + all true premises).
5. Since it is sound, the conclusion must be true. There is no possible scenario where the argument is sound and the conclusion fails.
6. **Conclusion: "Socrates is mortal" is guaranteed to be true.**

---

:::problem{tags="sound-true-conclusion"}
:::

---

# Invalid vs. Unsound: Two Ways to Fail

When an argument fails to prove its conclusion, there are exactly two possible reasons:

- **Invalid** (bad structure): The conclusion does not follow from the premises, even if the premises were true. Example: "It rained. Therefore, the Moon is full."
- **Unsound** (bad premise): The logic is fine, but at least one premise is false. Example: "All birds can fly. Penguins are birds. So penguins can fly."

An argument can fail in both ways simultaneously: it can be invalid _and_ have false premises. But the diagnoses are distinct:

- **Invalid** means: fix the _reasoning_.
- **Unsound** means: fix the _premises_.

---

## Worked Example: Diagnosing the Failure

**Argument:**

1. If it rains, the concert is canceled.
2. The concert is canceled.
3. $\therefore$ It rained.

**Steps:**

1. **Check validity:** Can both premises be true while the conclusion is false? Yes: the concert could be canceled for reasons other than rain (equipment failure, for example). Invalid.
2. Since the argument is invalid, it is automatically not sound.
3. **Diagnosis: the argument fails because of bad structure (invalid).** The premises do not guarantee the conclusion.

---

**Argument:**

1. All fish are mammals.
2. Salmon are fish.
3. $\therefore$ Salmon are mammals.

**Steps:**

1. **Check validity:** If all fish were mammals and salmon are fish, then salmon would be mammals. Valid.
2. **Check premises:** Premise 1 is false (fish are not mammals). Premise 2 is true.
3. **Diagnosis: the argument fails because of a bad premise (unsound).** The structure is fine, but Premise 1 is false.

---

:::problem{tags="diagnose-failure"}
:::
