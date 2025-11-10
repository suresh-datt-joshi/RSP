from fastapi import APIRouter

from ..models import AdviceCard, AdviceRequest, AdviceResponse

router = APIRouter()


def _build_advice_cards(request: AdviceRequest) -> list[AdviceCard]:
  farmer = request.farmer
  cards: list[AdviceCard] = []

  cards.append(
      AdviceCard(
          title="Soil Nutrition Plan",
          summary="Align nutrient application with crop demand curves.",
          category="nutrition",
          actions=[
              "Split nitrogen doses across three growth stages.",
              "Incorporate micronutrient mix (Zn, B) based on soil tests.",
              "Adopt fertigation if drip irrigation is available."
          ]
      )
  )

  if farmer.rainfall < 60 or farmer.irrigation_type == "rainfed":
    cards.append(
        AdviceCard(
            title="Water Conservation Toolkit",
            summary="Boost soil moisture retention to buffer dry spells.",
            category="water",
            actions=[
                "Lay straw mulch or crop residue between rows.",
                "Construct contour bunds or field channels for rainwater harvesting.",
                "Schedule irrigation during early morning or late evening."
            ]
        )
    )

  if farmer.soil_type in {"red", "laterite"}:
    cards.append(
        AdviceCard(
            title="Soil Health Booster",
            summary="Improve pH balance and microbial activity.",
            category="soil",
            actions=[
                "Apply farmyard manure at 5 t/ha before sowing.",
                "Use green manuring crops in the off-season.",
                "Consider dolomite liming if pH < 5.5."
            ]
        )
    )

  cards.append(
      AdviceCard(
          title="Pest & Disease Watchlist",
          summary="Monitor hotspots linked to current weather outlook.",
          category="pest",
          actions=[
              "Deploy pheromone traps at the field boundary.",
              "Scout for early signs of fungal infection after rainfall.",
              "Rotate active ingredients to avoid pesticide resistance."
          ]
      )
  )

  return cards


@router.post("", response_model=AdviceResponse, summary="Contextual agronomy advice")
async def post_advice(request: AdviceRequest) -> AdviceResponse:
  """
  Generate knowledge-base cards to improve yield for the supplied context.

  Uses lightweight rules today, but can be wired to a recommender or expert
  system in future iterations.
  """
  cards = _build_advice_cards(request)
  return AdviceResponse(knowledge_base=cards)

