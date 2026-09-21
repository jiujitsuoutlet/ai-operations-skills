---
name: approved-terms
description: The approved technical nouns and technical verbs for Jiu-Jitsu Outlet and Excelsior. One term, one concept. Canonical source for ASD-STE100 rules 1.8, 1.9, 1.11, 1.12, and 9.4. Read before writing any operational document. Parsed by check.py --glossary.
owner: Paul Nejat Tokgozoglu
version: 1.0
updated: 2026-08-18
status: sections 1 thru 5 and 7 thru 9 are approved. Section 6 is provisional and needs sign-off from the affiliation's technique authority.
---

# Approved Terms

## How to use this

STE permits three kinds of words: words approved in the ASD dictionary, technical nouns, and technical verbs. This file holds the second and third kinds for this subject field. It does not replace the dictionary.

Three rules make this file do its job:

1. **One term, one concept (rule 1.11).** If a document uses two words for one thing, the document fails.
2. **The Never use column is enforceable (rule 9.4).** A term in that column is a defect in an operational document, not a preference.
3. **Terms in the Never use column stay legal in persuasion copy** where brand voice governs, unless a brand standard already bans them. "Gym" is banned everywhere. "Kick off" is only banned in STE-register text.

Run the check:

```bash
python3 check.py draft.md --mode procedure --glossary approved-terms.md
```

## 1. Brand and organization

| Approved | Part | Meaning | Never use |
|---|---|---|---|
| Academy | n | A Jiu-Jitsu Outlet training location | gym, school, dojo, studio, club, box |
| Jiu-Jitsu Outlet | n | The academy brand. JJO is the approved short form | Jiu Jitsu Outlet, JJ Outlet, The Outlet Academy |
| JJO | n | Approved short form of Jiu-Jitsu Outlet | jjo, J.J.O. |
| Outlet | n | The brand identity, used alone only in brand context | |
| Mountain Grove | n | The Mountain Grove academy location | MG, Mtn Grove |
| Salem | n | The Salem academy location | |
| location | n | One physical academy site | branch, franchise, outpost |
| mat space | n | The trained-on surface area of an academy | floor space |

## 2. People and roles

| Approved | Part | Meaning | Never use |
|---|---|---|---|
| team member | n | An enrolled person who trains at the academy | student, pupil, client, customer, member (in training context) |
| ninja squad | n | The collective name for the team members | crew, squad (alone), family |
| coach | n | A person who leads a training session | instructor, teacher, professor, sensei |
| head coach | n | The coach responsible for a location | head instructor, owner-coach |
| kids | n | Team members under 13 | boys, girls, children (in copy), youngsters |
| teens | n | Team members 13 thru 17 | teenagers, young adults, youth |
| adults | n | Team members 18 and older | grown-ups |
| parent | n | The adult responsible for a kid or teen team member | guardian (unless legally required), mom, dad |
| lead | n | A person who has given contact details but has not enrolled | prospect, inquiry |
| visitor | n | A person who trains once without enrollment | drop-in, guest (in operational text) |
| staff | n | Paid personnel at a location | employees (unless a legal document) |

## 3. Programs and schedule

| Approved | Part | Meaning | Never use |
|---|---|---|---|
| training session | n | One scheduled instructional period on the mat | class, lesson, workout, session (alone in schedules) |
| open mat | n | An unstructured period for supervised training | free roll, open gym |
| seminar | n | A one-time instructional event with a guest coach | workshop, masterclass |
| camp | n | A multi-day training event | intensive, retreat |
| program | n | A named sequence of training sessions with an outcome | course, curriculum (see section 8), track |
| curriculum | n | The ordered technical content that a program teaches | syllabus, system (in program context) |
| No Sweat Intro | n | The first booked appointment for a lead | intro class, free trial, consultation |
| orientation | n | The onboarding session for a new team member | onboarding class, welcome class |
| schedule | n | The published times of training sessions | timetable, calendar (in academy context) |
| belt promotion | n | The event where rank is awarded | graduation, belt ceremony, testing |
| stripe | n | A rank marker awarded between belts | tab |
| Jamboree | n | The annual JJO community event | |
| [KIDS PROGRAM NAME] | n | The kids program... needs your approved name | |
| [TEENS PROGRAM NAME] | n | The teens program... needs your approved name | |
| [FUNDAMENTALS PROGRAM NAME] | n | The beginner adult program... needs your approved name | |

## 4. Sales, membership, and money

| Approved | Part | Meaning | Never use |
|---|---|---|---|
| membership | n | The recurring agreement to train | subscription, plan (alone), package |
| membership agreement | n | The signed contract | contract (in member-facing text), paperwork |
| enrollment | n | The act of starting a membership | signup, joining, registration |
| enroll | v | To start a membership | sign up, join up, get started (as a verb) |
| pause | n, v | A temporary stop of billing and training | freeze, hold, suspension |
| cancellation | n | The permanent end of a membership | quit, drop, termination (member-facing) |
| billing date | n | The date the payment processes | draft date, charge date |
| payment method | n | The card or account on file | card on file, billing info |
| tuition | n | The recurring amount a membership costs | fee, dues, price |
| offer | n | A defined package sold at a stated price | promo, deal, special |

Tuition amounts are never published in public documents. A lead books a No Sweat Intro first.

## 5. Facility and equipment

| Approved | Part | Meaning | Never use |
|---|---|---|---|
| mat | n | The training surface | tatami, canvas |
| gi | n | The traditional uniform | kimono, uniform (alone) |
| belt | n | The rank marker worn with the gi | |
| rash guard | n | The fitted top worn for no-gi training | rashie, compression shirt |
| no-gi | adj | Training without the gi | nogi, submission grappling (as a JJO term) |
| mouthguard | n | The protective dental appliance | mouth piece, gum shield |
| front desk | n | The reception position and area | reception, lobby desk |
| changing room | n | The room where team members change clothing | locker room, change room |

## 6. Technique nouns and verbs... PROVISIONAL

The affiliation is the authority on BJJ methodology and naming. Where the affiliation names a thing differently, the affiliation wins and this table gets corrected. Treat this section as a draft until it has the affiliation's sign-off.

| Approved | Part | Meaning | Never use |
|---|---|---|---|
| guard | n | A bottom position that controls the opponent with the legs | |
| closed guard | n | A guard with the ankles crossed behind the opponent | full guard |
| open guard | n | A guard without the ankles crossed | |
| half guard | n | A guard that controls one leg of the opponent | |
| mount | n | A top position that sits on the torso of the opponent | full mount |
| side control | n | A top position perpendicular to the opponent | side mount, cross side, 100 kilos |
| back control | n | A position behind the opponent with hooks | rear mount, taking the back (as a noun) |
| hook | n | A leg that controls the inside of the thigh of the opponent | |
| grip | n | A controlled hold on cloth or on the body | |
| frame | n | A rigid limb structure that holds distance | |
| sweep | n, v | A reversal from bottom to top | |
| pass | n, v | A movement through the guard to a top position | |
| escape | n, v | A movement out of a controlled position | |
| submission | n | A technique that causes the opponent to tap | tap out (as a noun), finish |
| tap | n, v | The signal that ends a round or an exchange | tap out |
| round | n | One timed exchange between two team members | match (in training context), go |
| roll | v | To train live with a partner | spar, fight, wrestle |
| drill | v | To repeat a technique with a cooperative partner | practice (as a verb) |
| shrimp | v | To move the hips away from the opponent | hip escape (see note) |
| bridge | v | To lift the hips off the mat | upa |
| post | v | To place a limb on the mat for support | base out |
| position | n | A defined arrangement of two bodies | |
| transition | n | A movement between two positions | |

"Roll" and "drill" are technical verbs in this subject field. Rule 1.12 permits them. Rule 1.11 then forbids "spar" and "practice" as substitutes.

If the affiliation teaches "hip escape" rather than "shrimp," the approved term changes to "hip escape" and "shrimp" moves to the Never use column.

## 7. Safety

Safety text obeys ASD-STE100 section 7. Name the risk level, command first, explain second.

| Approved | Part | Meaning | Never use |
|---|---|---|---|
| WARNING | n | A statement of a risk of injury or death | Danger, Attention, Heads up |
| CAUTION | n | A statement of a risk of damage to property | Careful, Note (for risk) |
| NOTE | n | A statement that gives information only | FYI, Remember |
| injury | n | Physical harm to a person | tweak, ding, boo-boo |
| injury report | n | The completed record of an injury | incident form, accident report |
| first aid kit | n | The stocked medical supply container | med kit |
| emergency contact | n | The person to call for a team member | ICE contact |
| aggression | n | Intent and force applied in training | controlled intensity, spirited effort |
| supervision | n | The direct watch of a coach over the mat | oversight, monitoring |

Never sanitize a risk. A warning that reads softly does not get obeyed.

## 8. Excelsior and Path of Learning

| Approved | Part | Meaning | Never use |
|---|---|---|---|
| Excelsior | n | The learning platform and the parent brand context | the app, the platform (alone) |
| Path of Learning | n | The knowledge tree interface. POL is the approved short form | learning path, skill tree, the map |
| POL | n | Approved short form of Path of Learning | pol, P.O.L. |
| COSMOS | n | The 3D rendered world of the Path of Learning | the galaxy, the universe |
| node | n | One unit of knowledge in the Path of Learning | topic, card, lesson node, star |
| branch | n | A connected sequence of nodes | path, line, track |
| learner | n | A person who uses Excelsior | user, student |
| recommender | n | The system that selects the next node | algorithm, engine, AI |
| phase | n | One of the four locked build stages | stage, milestone |
| Mat Squad | n | The online community | the Skool, the group |
| The Map | n | The Mat Squad curriculum artifact | |

Phase compression is forbidden. A document that describes phases out of order is a defect.

## 9. Content and operations

| Approved | Part | Meaning | Never use |
|---|---|---|---|
| SOP | n | A standard operating procedure | playbook, process doc, guide |
| work step | n | One numbered action in a procedure | step (alone in a spec), task |
| Definition of Done | n | The stated condition that completes a task | acceptance criteria, DoD |
| owner | n | The person responsible for a procedure | lead, responsible party |
| episode | n | One published podcast recording | show, pod |
| Beyond Homo Sapien | n | The podcast brand | BHS, the podcast (alone in operational text) |
| Jiu Jitsu Outlet Podcast | n | The JJO podcast brand | the JJO pod |
| post | n | One published piece of organic social content | content piece, creative |
| ad | n | One paid promotion | creative, campaign (unless it is a campaign) |
| campaign | n | A set of ads with one budget and one objective | |
| sequence | n | An ordered set of automated messages | drip, flow, nurture |
| agent | n | An AI worker with a defined role | bot, assistant |
| skill | n | An instruction file that an agent reads | prompt file, module |

## Governance

**Owner:** Paul. No other person adds a term.

**How to add a term.** Write the concept in one sentence. Search this file for an existing term that already covers it. If one exists, use it and stop. If none exists, add the row, list every synonym you rejected in the Never use column, and raise the version number.

**How to change a term.** Move the old term to the Never use column of the new row. Never delete a retired term, because a deleted term returns.

**Where it lives.** Vault (private note, not included). Agents read it from there. The copy in the `technical-english` skill folder is a mirror.

**Review.** Read this file when a new program launches, when a location opens or closes, and when the affiliation corrects a technical name.

## Open items

1. Section 6 needs sign-off from the affiliation's technique authority.
2. Three program names are unresolved... kids, teens, and the beginner adult program.
