# Mietteet tehtävästä:

Kirjoita puhtaaksi huomenna

Jäi datePicker sitten käyttämättä

- Näyttää kuluvan päivän hinnat bargraphina
- Näyttää kuluvan tunnin keskiarvohinnan
- Näyttää päivän ylimmän ja alimman varttihinnan
- Voi valita eilisen tai huomisen, jossa näytetään sitten samat ilman kuluvan tunnin hintaa
- Alempana on LineGraph, josta näkee kuluvan vuoden päivittäiset keskiarvot.
- Voi vaihtaa kuukausittaiseen näkymään.

Ongelmia:
- API:sta haetun datan lukeminen. Kesti jonkun aikaa tajuta, että sähkön spot-hinnat selivää vain lähitulevaisuudelle (huomiselle :D). Olisi varmaan ollut helposti keksittävissä jos pörssisähköön olisi joskus kiinnittänyt huomiota
- Vaikeutta oli myös siinä mitä aion tehdä. Aluksi halusin mahdollisuuden valita tietyn aikavälin datePickerillä, mutta yllä mainittu ongelma esti sen. Tai, ei estänyt mut teki siitä epämielekkään kun käyttäjää todennäköisesti menneisyys kiinnostaa vähemmän.
- Otin sitten mallia muista vastaavista ja mietin että päivittäisen hinnan esittäminen pylväsgraafina voisi olla hyvä. Pörssisähköä.fi toimi hyvänä inspiraationa.
- Yritin vielä lisää käyttää DatePickeriä, mutta se ei ollut aluksi mukava mobiilin kanssa. Sain kyllä toimimaan, mutta sitten mietin että tuntuu typerältä pakottaa ottamaan menneisyyden päiviä manuaalisesti niin päädyin vain yksinkertaiseen LineGraphiin esittämään kuluvan vuoden alusta hinnat.

# Ohjelmointitehtävä – Akamon

Toteuta React-sovellus, joka näyttää sähkön spot-hinnan valitulla aikavälillä.

## Vaatimukset

- Tehtävä tulee toteuttaa Reactilla ja Typescriptillä.
- Data tulee hakea Akamonin avoimesta GraphQL rajapinnasta.
- Hintojen yksikkö on datassa EUR/MWh, mutta käyttöliittymällä näkyvät hinnat tulee esittää yksikössä snt/kWh.
- Hinnat tulee näyttää arvonlisäverollisina.

## Tarvittavat tiedot datan hakemiseen

Endpoint: https://graphql.staging.akamon.cloud/

### Kysely datan hakemiseen

Käytä tehtävässä seuraavaa GraphQL-kyselyä hakeaksesi spot-hinnat.
`marketPrices`-kysely ei vaadi autentikointia.

```graphql
query spot_price_chart_SpotPricePeriodicQuery(
  $tenantId: ID!
  $deliveryArea: String!
  $start: String!
  $end: String!
  $resolution: String!
) {
  marketPrices {
    periodicSpotPrices(
      tenantId: $tenantId
      deliveryArea: $deliveryArea
      start: $start
      end: $end
      resolution: $resolution
    ) {
      maxPriceWithoutVat
      meanPriceWithoutVat
      minPriceWithoutVat
      period {
        complete
        end
        identifier
        length {
          days
          hours
        }
        start
        type
      }
      unit
    }
  }
}
```

### Parametrit

| Parametri      | Tyyppi    | Kuvaus                                    | Esimerkki                                                                    |
| -------------- | --------- | ----------------------------------------- | ---------------------------------------------------------------------------- |
| `tenantId`     | `ID!`     | Tenant-tunniste                           | `"AKAMON"`                                                                   |
| `deliveryArea` | `String!` | Toimitus-/hinta-alue (ISO 3166-1 alpha-2) | `"FI"` (Suomi), `"SE1"`, `"SE2"`, `"SE3"`, `"SE4"`, `"NO1"`, `"DK1"`, `"EE"` |
| `start`        | `String!` | Aikajakson alku (ISO 8601)                | `"2024-01-01T00:00:00Z"`                                                     |
| `end`          | `String!` | Aikajakson loppu (ISO 8601)               | `"2024-01-31T23:59:59Z"`                                                     |
| `resolution`   | `String!` | Resoluutio/tarkkuus                       | `"pt15m"`, `"hour"`, `"day"`, `"week"`, `"month"`                            |

### Paluuarvo

Rajapinta palauttaa taulukon `PeriodicSpotPrice`-objekteja:

```typescript
type PeriodicSpotPrice {
  period: Period!                   // Jakson tiedot
  meanPriceWithoutVat: Float!       // Keskihinta (ilman ALV)
  minPriceWithoutVat: Float!        // Minimihinta (ilman ALV)
  maxPriceWithoutVat: Float!        // Maksimihinta (ilman ALV)
  unit: String!                     // Yksikkö (yleensä "EUR/MWh")
}

type Period {
  start: String!                    // Jakson alku (ISO 8601)
  end: String!                      // Jakson loppu (ISO 8601)
  type: String!                     // Tyyppi: "pt15m", "hour", "day", "week", "month"
  identifier: String!               // Tunniste, esim. "2024-01", "2024-W01"
  complete: Boolean!                // Onko jakso täydellinen/valmis
  length: PeriodLength!             // Jakson pituus
}

type PeriodLength {
  days: Int!                        // Päivien määrä
  hours: Int!                       // Tuntien määrä
}
```

## Tyylit

- Tehtävän ulkoasulle ei ole rajoitteita, mutta käytettävyyden ja selkeyden tulee olla kunnossa. Käytä mielikuvitusta ja luovuutta!
- Sovelluksen pitää olla responsiivinen, eli käytettävä myös mobiilissa.

## Tehtävän palautus

Tehtävän voi palauttaa laittamalla sähköpostiin linkin avoimeen git-repoon. Tehtävän lisäksi palautuksessa tulee olla lyhyt kuvaus (noin 150 sanaa) siitä, mitä teki, missä kohdissa oli ongelmia ja miten ne ratkaistiin. Tämän lisäksi arvio tehtävään käytetystä ajasta. Tehtävän palautus viimeistään tiistain 5.5. aikana.
Onnea tehtävän tekemiseen!
