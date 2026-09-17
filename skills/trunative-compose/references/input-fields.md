# Input fields

Lookup only. The rules live in `heuristics/forms.md`. Open this file for one field's keyboard or autofill name, not as background reading.

Two settings per field, and they are separate: the keyboard decides what the user can type, the content type decides what the platform can fill in for them. Setting one does not set the other.

## Keyboard type

| Field | SwiftUI `.keyboardType` | Compose `KeyboardType` | Flutter `TextInputType` | React Native `keyboardType` | Web `inputmode` |
|---|---|---|---|---|---|
| email | `.emailAddress` | `Email` | `.emailAddress` | `email-address` | `email` |
| telephone | `.phonePad` | `Phone` | `.phone` | `phone-pad` | `tel` |
| whole number | `.numberPad` | `Number` | `.number` | `number-pad` | `numeric` |
| money or measure | `.decimalPad` | `Decimal` | `.numberWithOptions(decimal: true)` | `decimal-pad` | `decimal` |
| URL | `.URL` | `Uri` | `.url` | `url` | `url` |
| search | `.webSearch` | `Text` | `.text` | `web-search` | `search` |
| password | `.default` | `Password` | `.visiblePassword` where shown | `default` | `text` |
| multi-line note | `.default` | `Text` | `.multiline` | `default` | `text` |

Card numbers and one time codes are numeric keyboards over a text field, never a number field. A number field brings steppers, drops leading zeros, and on the web turns a mistyped digit into a scroll event.

## Return key

| Meaning | SwiftUI | Compose | Flutter | React Native | Web |
|---|---|---|---|---|---|
| next field | `.submitLabel(.next)` | `ImeAction.Next` | `TextInputAction.next` | `returnKeyType="next"` | `enterkeyhint="next"` |
| last field | `.submitLabel(.done)` | `ImeAction.Done` | `TextInputAction.done` | `"done"` | `"done"` |
| submit now | `.submitLabel(.go)` | `ImeAction.Go` | `TextInputAction.go` | `"go"` | `"go"` |
| search | `.submitLabel(.search)` | `ImeAction.Search` | `TextInputAction.search` | `"search"` | `"search"` |

## Autofill content type

| Value | SwiftUI `.textContentType` | Compose `ContentType` | Flutter `AutofillHints` | React Native `autoComplete` | Web `autocomplete` |
|---|---|---|---|---|---|
| email | `.emailAddress` | `EmailAddress` | `.email` | `email` | `email` |
| username | `.username` | `Username` | `.username` | `username` | `username` |
| existing password | `.password` | `Password` | `.password` | `current-password` | `current-password` |
| new password | `.newPassword` | `NewPassword` | `.newPassword` | `new-password` | `new-password` |
| one time code | `.oneTimeCode` | `SmsOtpCode` | `.oneTimeCode` | `sms-otp` | `one-time-code` |
| full name | `.name` | `PersonFullName` | `.name` | `name` | `name` |
| given name | `.givenName` | `PersonFirstName` | `.givenName` | `given-name` | `given-name` |
| family name | `.familyName` | `PersonLastName` | `.familyName` | `family-name` | `family-name` |
| telephone | `.telephoneNumber` | `PhoneNumber` | `.telephoneNumber` | `tel` | `tel` |
| street | `.streetAddressLine1` | `AddressStreet` | `.streetAddressLine1` | `street-address` | `street-address` |
| city | `.addressCity` | `AddressLocality` | `.addressCity` | `postal-address-locality` | `address-level2` |
| postal code | `.postalCode` | `PostalCode` | `.postalCode` | `postal-code` | `postal-code` |
| country | `.countryName` | `AddressCountry` | `.countryName` | `country` | `country-name` |
| card number | `.creditCardNumber` | `CreditCardNumber` | `.creditCardNumber` | `cc-number` | `cc-number` |
| card expiry | `.creditCardExpiration` | `CreditCardExpirationDate` | `.creditCardExpirationDate` | `cc-exp` | `cc-exp` |
| security code | `.creditCardSecurityCode` | `CreditCardSecurityCode` | `.creditCardSecurityCode` | `cc-csc` | `cc-csc` |

On iOS, the same attribute is `textContentType` on `UITextField` and a prop of the same name in React Native, which is the one that drives fill on that platform.

On Android, the Compose semantics property landed in Compose 1.8; view layouts use `android:autofillHints` with the `AUTOFILL_HINT_*` string of the same meaning.

## Grouping and saving

A credential is filled and saved as a set, so the fields have to be declared as one.

- SwiftUI: fields in the same form are grouped by the system; submit ends the session.
- Compose: read `LocalAutofillManager` and call `commit()` when the form is submitted, or nothing is offered for saving.
- Flutter: wrap the fields in `AutofillGroup`, then call `TextInput.finishAutofillContext()` on submit.
- React Native: `importantForAutofill` on the container, plus the props above per field.
- Web: one `<form>` element around the fields, and a real submit.

## One time codes

One field, numeric keyboard, the one time code content type. The platform reads the message and offers the digits above the keyboard.

- iOS fills from Messages with no extra work once `.oneTimeCode` is set.
- Android reads the SMS through the SMS Retriever API, or the User Consent API where the message is not formatted for retrieval.
- Mobile web can additionally use the WebOTP API through `navigator.credentials.get()` with an `otp` request.

## Capitalisation and correction

| Field | Capitalisation | Autocorrect |
|---|---|---|
| email, username, password, code, URL | none | off |
| person or street name | words | off |
| free text, note, message | sentences | on |

The names of these settings: `.textInputAutocapitalization()` and `.autocorrectionDisabled()` in SwiftUI, `KeyboardOptions(capitalization =, autoCorrectEnabled =)` in Compose, `textCapitalization` and `autocorrect` in Flutter, `autoCapitalize` and `autoCorrect` in React Native, `autocapitalize` and `autocorrect` in HTML.
