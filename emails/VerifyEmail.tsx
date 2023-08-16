import {
  Body,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
} from '@react-email/components';

interface verifyEmailProps {
  code: string;
  displayName: string;
}

const VerifyEmail = ({ code, displayName }: verifyEmailProps) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Overte si účet na fatran.sk.</Preview>
      <Tailwind>
        <Body className="bg-white">
          <Container className="py-[2rem] !mx-auto">
            <Section className="text-black w-[15rem]">
              <Column>
                <Img
                  src="https://imgur.com/KDlbM7d.png"
                  width="50px"
                  className="opacity-30"
                />
              </Column>

              <Column className="pl-[1rem]">
                <p className="font-semibold opacity-[.25]">
                  37. zbor Fatran Martin
                </p>
              </Column>
            </Section>

            <Section className="px-[20%]">
              <Section className="border-solid border border-gray-300 rounded-md overflow-hidden relative">
                <Section className="px-[2rem] py-[2rem] text-gray-800">
                  <h4 className="m-0">
                    Milá/Milý {displayName?.replace('_', ' ')},
                  </h4>
                  <p className="text-sm">
                    Nižšie uvedený kód použite pre overenie svojho e-mailu,{' '}
                    <br />
                    čím dokončíte registračný proces a dostanete plný prístup ku
                    všetkým funkciám.
                  </p>

                  <h1 className="w-full text-4xl text-center text-blue-500 bg-blue-100 rounded-md py-[1rem] tracking-widest">
                    {code}
                  </h1>
                  <p className="text-sm">
                    Ďakujeme za registráciu. <br />S pozdravom <br />
                    37. zbor Fatran Martin.
                  </p>
                </Section>
              </Section>
              <p className="text-gray-600 text-xs px-[5rem]">
                Na tento e-mail prosím neodpovedajte. Ak máte nejaké otázky,
                môžete nám napísať sem:{' '}
                <span className="text-blue-500 font-semibold">
                  info@fatran.sk
                </span>{' '}
                alebo na naše sociálne siete.
              </p>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerifyEmail;
