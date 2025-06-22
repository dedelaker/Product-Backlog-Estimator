# Frontend vs Backend Question Structure Comparison

## Complete Question-by-Question Analysis

| Position | Frontend Question ID | Frontend Question Text | Backend Question ID | Backend Question Text | Match Status |
|----------|---------------------|------------------------|--------------------|-----------------------|--------------|
| 1 | external_integration | Do we have to integrate or adapt solution of an external partner? (could be on YS side or in other teams) | external_integration | Do we have to integrate or adapt solution of an external partner? (could be on YS side or in other teams) | ✅ MATCH |
| 2 | app_touch | Do we have to touch all the part of the app (MPSA)? | app_touch | Do we have to touch all the part of the app (MPSA)? | ✅ MATCH |
| 3 | new_business | New business for Company 1 | new_business | New business for Company 1 | ✅ MATCH |
| 4 | future_scope | Future scope is clear? | future_scope | Future scope is clear? | ✅ MATCH |
| 5 | swe_dependencies | Do we have very high dependencies with SWE 1 or SWE 9? | legal_compliance | Legal or compliance requirements? | ❌ MISMATCH |
| 6 | fraud_compliance | Do we have impacts on Fraud/Compliance workflows | impact_scope | Impact scope assessment | ❌ MISMATCH |
| 7 | it_dependencies | Do we have IT dependencies about new hardware to order | data_security | Do we have to manage sensitive data? | ❌ MISMATCH |
| 8 | security_analysis | Do we have complex analysis of IT security? or Legal? (ex: for big impacts / critical outsourcing, AI guidelines) | design_knowledge | Do we have good knowledge about the design? | ❌ MISMATCH |
| 9 | new_technology | Do we have to use a new technology? | security_analysis | Do we have complex analysis of IT security? or Legal? (ex: for big impacts / critical outsourcing, AI guidelines) | ❌ MISMATCH |
| 10 | new_architecture | Do we have to put in place a new architecture? | new_technology | Do we have to use a new technology? | ❌ MISMATCH |
| 11 | - | - | new_architecture | Do we have to put in place a new architecture? | ❌ EXTRA BACKEND |

## Score Range Analysis

### Frontend Questions (10 questions total):
1. **external_integration**: 0-250 points
2. **app_touch**: 30-100 points  
3. **new_business**: 0-150 points
4. **future_scope**: 50-100 points
5. **swe_dependencies**: 0-300 points (HIGH IMPACT)
6. **fraud_compliance**: 0-30 points
7. **it_dependencies**: 0-50 points
8. **security_analysis**: 0-150 points
9. **new_technology**: 0-100 points
10. **new_architecture**: 0-100 points

**Frontend Total Possible Score**: 1,330 points

### Backend Questions (11 questions total):
1. **external_integration**: 0-250 points
2. **app_touch**: 30-100 points
3. **new_business**: 0-150 points
4. **future_scope**: 50-100 points
5. **legal_compliance**: 0-100 points
6. **impact_scope**: 30-100 points
7. **data_security**: 0-50 points
8. **design_knowledge**: 30-100 points
9. **security_analysis**: 0-150 points
10. **new_technology**: 0-100 points
11. **new_architecture**: 0-100 points

**Backend Total Possible Score**: 1,230 points

## Critical Issues Found

### 1. Question Count Mismatch
- **Frontend**: 10 questions
- **Backend**: 11 questions
- **Impact**: Array index misalignment causes wrong answers to be matched with wrong questions

### 2. Missing High-Impact Questions in Backend
- **swe_dependencies** (0-300 points) - MISSING from backend
- **fraud_compliance** (0-30 points) - MISSING from backend  
- **it_dependencies** (0-50 points) - MISSING from backend

### 3. Extra Questions in Backend
- **legal_compliance** (0-100 points) - NOT in frontend
- **impact_scope** (30-100 points) - NOT in frontend
- **data_security** (0-50 points) - NOT in frontend
- **design_knowledge** (30-100 points) - NOT in frontend

### 4. Position Misalignment
Starting from position 5, every question is misaligned, causing:
- Frontend answer[4] (swe_dependencies) → Backend question[4] (legal_compliance)
- Frontend answer[5] (fraud_compliance) → Backend question[5] (impact_scope)
- And so on...

## Scoring Calculation Error Example
For TEST5 with frontend score 525:
- Frontend calculates based on its 10-question structure
- Backend receives same answer array but applies to its different 11-question structure
- Result: Completely different score (375) due to question misalignment

## Solution Required
The backend question structure must be **completely replaced** with the exact frontend structure to fix the scoring mismatch.