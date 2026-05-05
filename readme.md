# Mietteet tehtävästä:

Tehtävään tein kuluvan päivän, eilisen ja huomisen hintojen näyttämisen BarGraphilla. Päivät voi valita ylhäällä olevista näppäimistä. Tämän päivän kuluvan tunnin hinnan näkee myös, kun on tämän päivän hintanäkymä päällä. Sovellus näyttää myös kyseisten päivien korkeimman ja pienimmän varttihinnan. Tämän lisäksi sovellus näyttää LineGraphilla kuluvan vuoden päivittäiset hinnat tai nappia painamalla sen saa vaihdettua kuukausinäkymään.

Tehtävässä hankalinta oli aluksi liikkeelle lähteminen, koska typescript oli uutta. Sen ymmärtämisessä ei onneksi kauaa mennyt. Ongelmaksi nousi sitten GraphQL haetun datan käyttäminen. Onglemaa ei itse datan käsittelyssä periaatteessa ollut, vaan ongelma oli tajuta, että huomisen hintojen jälkeen ei ole tulevaisuuden hintoja olemassakaan. Aluksi tavoitteenani oli käyttää datePickeriä, jotta käyttäjä voisi valita haluamansa päivät, mutta datePicker vaikutti turhauttavalta käyttää sen jälkeen, kun olisi voinut melkein vain menneisyyden hintoja valita. Tästä syystä päädyinkin näyttämään hinnat nykyisellä tavalla. Yritin vielä lopuksi näyttää pidempiä aikavälejä datePickerien avulla, mutta pienen mobiilikäytettävyystaistelun jälkeen (jonka kyllä ratkaisin) tulin siihen tulokseen, että käyttäjän ei ole mukava selata pitkälle menneisyyteen nähdäkseen jotain graafista. LineGraphin päivityksen oli viimeinen ongelma, mutta siihen en enää ehtinyt aikaa käyttää.

Tehtävään kului arvioilta kahdeksasta kymmeneen aktiivista tuntia, mutta tein sitä pääasiassa maanantaina pitkin päivää.

-------------------

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
