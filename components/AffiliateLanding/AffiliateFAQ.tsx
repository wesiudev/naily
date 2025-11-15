"use client";
import FAQ from "../FAQ/FAQ";

export default function AffiliateFAQ() {
  const items = [
    {
      id: "faq-1",
      question: "Jak szybko mogę zacząć zarabiać?",
      answer:
        "Od razu po rejestracji możesz rozpocząć polecanie Naily. Gdy stylistka z Twojego linku aktywuje płatny plan (99 zł/mies.), Twoja pierwsza prowizja pojawi się automatycznie w panelu Stripe.",
    },
    {
      id: "faq-2",
      question: "Czy udział w programie jest płatny?",
      answer:
        "Nie! Udział w programie partnerskim Naily jest całkowicie darmowy. Nie pobieramy żadnych opłat rejestracyjnych, abonamentów ani prowizji od Twoich zarobków.",
    },
    {
      id: "faq-3",
      question: "Jak naliczane są prowizje?",
      answer:
        "Otrzymujesz 20% prowizji od każdej opłaconej subskrypcji stylistki, którą polecisz. System automatycznie nalicza wynagrodzenie po każdej płatności, więc nie musisz niczego zgłaszać ręcznie.",
    },
    {
      id: "faq-4",
      question: "Ile stylistek muszę zaprosić, żeby zarabiać konkretną kwotę?",
      answer:
        "Każda aktywna stylistka wnosi 99 zł/mies., więc przykładowo: 5 stylistek = ok. 99 zł/mies. prowizji, 20 stylistek = ok. 396 zł/mies. (i tak dalej). Twoje zarobki rosną wraz z liczbą aktywnych poleceń.",
    },
    {
      id: "faq-5",
      question: "Kiedy i jak otrzymam wypłatę prowizji?",
      answer:
        "Wypłaty realizujemy bezpiecznie przez Stripe – możesz ustawić, czy chcesz otrzymywać środki codziennie, co tydzień lub co miesiąc. Wszystkie transakcje są szyfrowane i w pełni transparentne.",
    },
    {
      id: "faq-7",
      question: "Czy moje linki partnerskie wygasają?",
      answer:
        "Nie, Twoje linki partnerskie są bezterminowe. Jeśli stylistka kliknie Twój link i w przyszłości wykupi plan, system automatycznie przypisze Ci prowizję.",
    },
    {
      id: "faq-8",
      question: "Czy mogę zwiększyć swoją prowizję?",
      answer:
        "Tak! Najaktywniejsi partnerzy mogą awansować i otrzymywać wyższy procent prowizji. Jeśli regularnie zapraszasz nowe stylistki – nasz zespół zaproponuje Ci indywidualne warunki współpracy.",
    },
    {
      id: "faq-9",
      question: "Co stanie się z moimi wcześniejszymi prowizjami po awansie?",
      answer:
        "Wszystkie Twoje wcześniejsze polecenia zachowują się bez zmian, a nowe subskrypcje są naliczane już według wyższego procentu. Nie tracisz żadnych dotychczasowych zarobków.",
    },
    {
      id: "faq-10",
      question: "Czy istnieją limity zarobków?",
      answer:
        "Nie ma żadnych limitów! Możesz polecać Naily dowolnej liczbie stylistek i rozwijać swoje dochody w nieskończoność. Im więcej aktywnych kont – tym większe Twoje zarobki.",
    },
  ];

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-3 animate-bounce-gentle"
          style={{
            background: "linear-gradient(135deg, #ff8f00 0%, #ec7308 100%)",
            animationDelay: "3s",
          }}
        ></div>
      </div>

      <div className="relative z-10">
        <FAQ items={items} />
      </div>
    </section>
  );
}
