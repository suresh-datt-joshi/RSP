from datetime import date, timedelta
from typing import List, Dict
import httpx

from ..models.crop_lifecycle import (
    CropLifecycleRequest,
    CropLifecycleResponse,
    CropStage,
    WeatherAlert
)


class CropLifecycleService:
    """Service for generating crop lifecycle calendars with weather-based recommendations"""
    
    CROP_DATA = {
        "wheat": {
            "name": "Wheat",
            "total_days": 135,
            "stages": [
                {
                    "name": "Germination & Emergence",
                    "duration": 10,
                    "description": "Seed germination and seedling emergence phase",
                    "irrigation_frequency": "Light watering every 2-3 days",
                    "activities": [
                        "Ensure soil moisture is adequate for germination",
                        "Monitor for uniform emergence",
                        "Protect from birds if necessary"
                    ],
                    "fertilizers": ["Apply basal fertilizer (Phosphorus and Potassium)"],
                    "weather": "Requires moderate temperature (15-20°C) and consistent moisture",
                    "risks": ["Bird damage", "Poor germination due to drought", "Waterlogging"]
                },
                {
                    "name": "Tillering",
                    "duration": 30,
                    "description": "Plant produces multiple shoots from the base",
                    "irrigation_frequency": "Irrigate every 7-10 days depending on rainfall",
                    "activities": [
                        "First weeding at 20-25 days after sowing",
                        "Monitor for pest attacks (aphids, shoot fly)",
                        "Ensure proper plant spacing"
                    ],
                    "fertilizers": ["Apply first dose of nitrogen (30-40% of total)"],
                    "weather": "Cool temperatures favor tillering. Avoid waterlogging",
                    "risks": ["Weed competition", "Aphid infestation", "Frost damage in cold regions"]
                },
                {
                    "name": "Stem Elongation",
                    "duration": 25,
                    "description": "Rapid vertical growth of stems",
                    "irrigation_frequency": "Critical irrigation period - every 7 days",
                    "activities": [
                        "Second weeding if needed",
                        "Monitor for stem borer and rust diseases",
                        "Ensure adequate drainage"
                    ],
                    "fertilizers": ["Apply second dose of nitrogen (30% of total)"],
                    "weather": "Requires consistent moisture and moderate temperatures",
                    "risks": ["Stem borer", "Rust diseases", "Lodging due to excessive nitrogen"]
                },
                {
                    "name": "Booting & Heading",
                    "duration": 15,
                    "description": "Formation and emergence of grain head",
                    "irrigation_frequency": "Most critical - irrigate every 5-7 days",
                    "activities": [
                        "Monitor for head diseases (smut, bunt)",
                        "Protect from high winds",
                        "Scout for aphids on heads"
                    ],
                    "fertilizers": ["Light nitrogen application if needed (10-20% of total)"],
                    "weather": "Cool nights and warm days are ideal. Avoid heat stress",
                    "risks": ["Head smut", "Aphids", "Heat stress affecting grain formation"]
                },
                {
                    "name": "Flowering & Grain Filling",
                    "duration": 30,
                    "description": "Pollination and grain development phase",
                    "irrigation_frequency": "Irrigate every 7-10 days, reduce towards maturity",
                    "activities": [
                        "Monitor grain filling progress",
                        "Scout for grain-sucking insects",
                        "Protect from birds as grains mature"
                    ],
                    "fertilizers": ["Foliar spray of micronutrients if deficiency observed"],
                    "weather": "Warm days and adequate moisture needed. Avoid heat waves",
                    "risks": ["Grain shriveling due to heat", "Bird damage", "Grain-sucking bugs"]
                },
                {
                    "name": "Maturation & Drying",
                    "duration": 25,
                    "description": "Grain reaches physiological maturity",
                    "irrigation_frequency": "Stop irrigation 10-15 days before harvest",
                    "activities": [
                        "Monitor grain moisture content",
                        "Prepare harvesting equipment",
                        "Plan harvest timing to avoid shattering"
                    ],
                    "fertilizers": ["No fertilizer application"],
                    "weather": "Dry weather ideal. Avoid rains that can cause sprouting",
                    "risks": ["Pre-harvest sprouting if rain occurs", "Grain shattering", "Lodging"]
                }
            ]
        },
        "rice": {
            "name": "Rice",
            "total_days": 120,
            "stages": [
                {
                    "name": "Germination & Seedling",
                    "duration": 20,
                    "description": "Seed germination and early seedling development",
                    "irrigation_frequency": "Keep nursery bed continuously moist/flooded",
                    "activities": [
                        "Prepare nursery beds with fine tilth",
                        "Sow pre-germinated seeds",
                        "Maintain water level at 2-3 cm"
                    ],
                    "fertilizers": ["Apply basal fertilizer in nursery bed"],
                    "weather": "Warm temperatures (25-35°C) and consistent water supply needed",
                    "risks": ["Damping off disease", "Rat damage", "Poor germination"]
                },
                {
                    "name": "Transplanting & Establishment",
                    "duration": 10,
                    "description": "Seedlings transplanted to main field",
                    "irrigation_frequency": "Maintain 2-5 cm standing water",
                    "activities": [
                        "Transplant 20-25 day old seedlings",
                        "Maintain proper spacing (20x15 cm)",
                        "Remove weeds before flooding"
                    ],
                    "fertilizers": ["Apply basal dose (50% nitrogen, full P & K)"],
                    "weather": "Adequate water for establishment. Avoid water stress",
                    "risks": ["Transplanting shock", "Weed emergence", "Leaf folder attack"]
                },
                {
                    "name": "Tillering",
                    "duration": 30,
                    "description": "Production of tillers from main plant",
                    "irrigation_frequency": "Maintain 3-5 cm water depth",
                    "activities": [
                        "First weeding at 15-20 days after transplanting",
                        "Monitor for stem borer and leaf folder",
                        "Ensure proper water management"
                    ],
                    "fertilizers": ["Apply first top dressing of nitrogen (25% of total) at 20-25 DAT"],
                    "weather": "Warm weather with adequate water promotes tillering",
                    "risks": ["Stem borer", "Brown plant hopper", "Blast disease"]
                },
                {
                    "name": "Panicle Initiation",
                    "duration": 15,
                    "description": "Formation of panicle (grain head) inside stem",
                    "irrigation_frequency": "Critical stage - maintain 5 cm water depth",
                    "activities": [
                        "Second weeding if necessary",
                        "Monitor for nutrient deficiency symptoms",
                        "Scout for pests and diseases"
                    ],
                    "fertilizers": ["Apply second top dressing of nitrogen (25% of total)"],
                    "weather": "Sensitive to water stress. Ensure adequate water supply",
                    "risks": ["Water stress reducing panicle size", "Neck blast", "Sheath blight"]
                },
                {
                    "name": "Flowering & Grain Filling",
                    "duration": 30,
                    "description": "Flowering and grain development",
                    "irrigation_frequency": "Maintain 3-5 cm water until dough stage",
                    "activities": [
                        "Monitor grain filling",
                        "Protect from birds",
                        "Scout for grain-sucking insects"
                    ],
                    "fertilizers": ["Foliar spray of potassium if needed for grain filling"],
                    "weather": "Warm days and cool nights ideal. Avoid heat during flowering",
                    "risks": ["Poor pollination due to heat", "Grain discoloration", "Bird damage"]
                },
                {
                    "name": "Ripening & Maturity",
                    "duration": 15,
                    "description": "Grains mature and field is drained",
                    "irrigation_frequency": "Drain field 10-15 days before harvest",
                    "activities": [
                        "Monitor grain maturity (80-85% golden grains)",
                        "Prepare for harvest",
                        "Protect from birds and rats"
                    ],
                    "fertilizers": ["No fertilizer application"],
                    "weather": "Dry weather preferred for harvest. Avoid continuous rain",
                    "risks": ["Grain shattering", "Lodging", "Rat damage"]
                }
            ]
        },
        "maize": {
            "name": "Maize (Corn)",
            "total_days": 100,
            "stages": [
                {
                    "name": "Germination & Emergence",
                    "duration": 8,
                    "description": "Seed germinates and seedling emerges",
                    "irrigation_frequency": "Light irrigation immediately after sowing, then as needed",
                    "activities": [
                        "Ensure seed is planted at proper depth (3-5 cm)",
                        "Protect from birds and rodents",
                        "Check for uniform emergence"
                    ],
                    "fertilizers": ["Apply basal fertilizer (full P & K, 25% nitrogen)"],
                    "weather": "Warm soil (18-30°C) and adequate moisture required",
                    "risks": ["Poor germination", "Bird damage", "Cutworm attack"]
                },
                {
                    "name": "Vegetative Growth",
                    "duration": 30,
                    "description": "Rapid leaf and root development",
                    "irrigation_frequency": "Irrigate every 7-10 days depending on rainfall",
                    "activities": [
                        "First weeding at 20 days after sowing",
                        "Earthing up around plants",
                        "Monitor for fall armyworm and stem borer"
                    ],
                    "fertilizers": ["Apply first top dressing of nitrogen (35% of total) at 25-30 DAS"],
                    "weather": "Warm temperatures and regular moisture for growth",
                    "risks": ["Fall armyworm", "Stem borer", "Weed competition"]
                },
                {
                    "name": "Tasseling",
                    "duration": 10,
                    "description": "Male flower (tassel) emerges",
                    "irrigation_frequency": "Critical period - irrigate every 5-7 days",
                    "activities": [
                        "Monitor for proper tasseling",
                        "Scout for pests on tassels",
                        "Ensure good plant health"
                    ],
                    "fertilizers": ["Apply second top dressing of nitrogen (40% of total)"],
                    "weather": "Sensitive to water stress. Ensure adequate moisture",
                    "risks": ["Water stress affecting tassel formation", "Aphids", "Blight diseases"]
                },
                {
                    "name": "Silking & Pollination",
                    "duration": 12,
                    "description": "Female flowers emerge and pollination occurs",
                    "irrigation_frequency": "Most critical - irrigate every 5 days if no rain",
                    "activities": [
                        "Ensure good pollination (check silk emergence)",
                        "Monitor for silk-eating insects",
                        "Protect from high winds"
                    ],
                    "fertilizers": ["Foliar spray of micronutrients if deficiency seen"],
                    "weather": "Water stress during this period severely reduces yield",
                    "risks": ["Poor pollination due to stress", "Corn earworm", "Silk feeders"]
                },
                {
                    "name": "Grain Filling",
                    "duration": 25,
                    "description": "Kernel development and filling",
                    "irrigation_frequency": "Irrigate every 7 days, reduce towards maturity",
                    "activities": [
                        "Monitor kernel development",
                        "Protect ears from birds and insects",
                        "Scout for ear rot diseases"
                    ],
                    "fertilizers": ["No additional fertilizer needed"],
                    "weather": "Adequate moisture needed for proper kernel filling",
                    "risks": ["Kernel abortion due to stress", "Ear rot", "Bird damage"]
                },
                {
                    "name": "Maturity & Harvest",
                    "duration": 15,
                    "description": "Grains reach physiological maturity",
                    "irrigation_frequency": "Stop irrigation 10 days before harvest",
                    "activities": [
                        "Monitor grain moisture (harvest at 20-25% moisture)",
                        "Prepare harvesting equipment",
                        "Plan for drying if needed"
                    ],
                    "fertilizers": ["No fertilizer application"],
                    "weather": "Dry weather ideal for harvest",
                    "risks": ["Stalk rot causing lodging", "Bird/animal damage", "Post-harvest losses"]
                }
            ]
        },
        "cotton": {
            "name": "Cotton",
            "total_days": 165,
            "stages": [
                {
                    "name": "Germination & Emergence",
                    "duration": 10,
                    "description": "Seed germination and cotyledon emergence",
                    "irrigation_frequency": "Pre-sowing irrigation, then light irrigation after 7-10 days",
                    "activities": [
                        "Ensure good seed bed preparation",
                        "Sow seeds at 3-5 cm depth",
                        "Monitor for uniform stand"
                    ],
                    "fertilizers": ["Apply basal dose (full P & K, 25% nitrogen)"],
                    "weather": "Warm soil temperature (18-30°C) required",
                    "risks": ["Poor germination", "Seedling diseases", "Cutworm damage"]
                },
                {
                    "name": "Seedling Establishment",
                    "duration": 20,
                    "description": "True leaf development and root establishment",
                    "irrigation_frequency": "Light irrigation every 10-12 days",
                    "activities": [
                        "Thinning to maintain proper plant population",
                        "First weeding",
                        "Monitor for jassids and thrips"
                    ],
                    "fertilizers": ["Apply first top dressing of nitrogen (30% of total) at 30 DAS"],
                    "weather": "Warm weather with moderate moisture",
                    "risks": ["Jassid attack", "Thrips", "Weed competition"]
                },
                {
                    "name": "Squaring",
                    "duration": 30,
                    "description": "Formation of flower buds (squares)",
                    "irrigation_frequency": "Irrigate every 10-15 days",
                    "activities": [
                        "Monitor for boll weevil and budworms",
                        "Second weeding and hoeing",
                        "Check for nutrient deficiencies"
                    ],
                    "fertilizers": ["Apply second top dressing of nitrogen (25% of total) at 50-60 DAS"],
                    "weather": "Warm days and adequate moisture promote squaring",
                    "risks": ["Boll weevil", "Budworm", "Square shedding due to stress"]
                },
                {
                    "name": "Flowering & Boll Formation",
                    "duration": 40,
                    "description": "Flowers open and bolls begin to develop",
                    "irrigation_frequency": "Critical period - irrigate every 7-10 days",
                    "activities": [
                        "Monitor for bollworms and pink bollworm",
                        "Hand-pick damaged bolls",
                        "Ensure good pollination"
                    ],
                    "fertilizers": ["Apply third dose of nitrogen (20% of total) at peak flowering"],
                    "weather": "Sensitive to water stress. High humidity may cause disease",
                    "risks": ["Bollworms", "Boll shedding", "Boll rot in humid conditions"]
                },
                {
                    "name": "Boll Development",
                    "duration": 40,
                    "description": "Bolls mature and fiber develops",
                    "irrigation_frequency": "Irrigate every 10-15 days, reduce late in stage",
                    "activities": [
                        "Continue monitoring for pests",
                        "Remove diseased bolls",
                        "Prepare for harvest"
                    ],
                    "fertilizers": ["Foliar spray of potassium if needed"],
                    "weather": "Warm, dry weather ideal for boll maturation",
                    "risks": ["Late season pests", "Boll rot", "Premature opening"]
                },
                {
                    "name": "Boll Opening & Harvest",
                    "duration": 25,
                    "description": "Bolls open and cotton is ready for picking",
                    "irrigation_frequency": "Stop irrigation 2-3 weeks before harvest",
                    "activities": [
                        "Hand-pick or machine harvest when 60-70% bolls open",
                        "Pick clean, dry cotton",
                        "Multiple pickings may be needed"
                    ],
                    "fertilizers": ["No fertilizer application"],
                    "weather": "Dry weather essential for quality harvest",
                    "risks": ["Rain staining fiber", "Loss of quality", "Leaf contamination"]
                }
            ]
        },
        "soybean": {
            "name": "Soybean",
            "total_days": 95,
            "stages": [
                {
                    "name": "Germination & Emergence",
                    "duration": 8,
                    "description": "Seed germinates and seedling emerges",
                    "irrigation_frequency": "Ensure adequate soil moisture at sowing",
                    "activities": [
                        "Inoculate seeds with rhizobium if needed",
                        "Sow at 3-4 cm depth",
                        "Monitor emergence uniformity"
                    ],
                    "fertilizers": ["Apply starter fertilizer (P & K, minimal nitrogen)"],
                    "weather": "Warm soil (18-25°C) and good moisture required",
                    "risks": ["Poor emergence", "Damping off", "Seed rot"]
                },
                {
                    "name": "Vegetative Growth (V1-V5)",
                    "duration": 25,
                    "description": "Development of true leaves and nodes",
                    "irrigation_frequency": "Irrigate as needed to avoid stress (every 10-12 days)",
                    "activities": [
                        "First weeding at 15-20 days",
                        "Monitor for leaf-eating caterpillars",
                        "Ensure good nodulation on roots"
                    ],
                    "fertilizers": ["Usually no nitrogen needed if nodulation is good, apply if deficient"],
                    "weather": "Moderate temperatures and adequate moisture",
                    "risks": ["Weed competition", "Leaf miners", "Poor nodulation"]
                },
                {
                    "name": "Flowering (R1-R2)",
                    "duration": 15,
                    "description": "Flower initiation and open flowering",
                    "irrigation_frequency": "Critical period - irrigate every 7 days",
                    "activities": [
                        "Monitor flowering progress",
                        "Scout for pod borers and aphids",
                        "Ensure adequate bee activity for pollination"
                    ],
                    "fertilizers": ["Foliar spray of boron and molybdenum if deficiency observed"],
                    "weather": "Water stress during flowering significantly reduces yield",
                    "risks": ["Flower drop due to stress", "Aphids", "Pod borers"]
                },
                {
                    "name": "Pod Formation (R3-R4)",
                    "duration": 15,
                    "description": "Pods form and seeds begin to develop",
                    "irrigation_frequency": "Most critical - irrigate every 5-7 days if no rain",
                    "activities": [
                        "Monitor pod set",
                        "Protect from pod-boring insects",
                        "Ensure good plant health"
                    ],
                    "fertilizers": ["Foliar spray of potassium for better pod filling"],
                    "weather": "Adequate moisture essential for pod formation",
                    "risks": ["Pod abortion due to stress", "Pod borer damage", "Pod shedding"]
                },
                {
                    "name": "Seed Filling (R5-R6)",
                    "duration": 20,
                    "description": "Seeds develop and fill within pods",
                    "irrigation_frequency": "Irrigate every 7-10 days, reduce towards maturity",
                    "activities": [
                        "Monitor seed development",
                        "Protect from birds and pod feeders",
                        "Scout for late season diseases"
                    ],
                    "fertilizers": ["No additional fertilizer typically needed"],
                    "weather": "Adequate moisture needed for proper seed filling",
                    "risks": ["Shriveled seeds due to stress", "Stink bugs", "Seed rot"]
                },
                {
                    "name": "Maturity & Harvest (R7-R8)",
                    "duration": 12,
                    "description": "Plants mature and pods ready for harvest",
                    "irrigation_frequency": "Stop irrigation 10-15 days before harvest",
                    "activities": [
                        "Monitor pod color (brown when mature)",
                        "Harvest when moisture is 13-15%",
                        "Prepare combine or threshing equipment"
                    ],
                    "fertilizers": ["No fertilizer application"],
                    "weather": "Dry weather ideal for harvest",
                    "risks": ["Pod shattering", "Harvest delays due to rain", "Seed quality loss"]
                }
            ]
        },
        "sugarcane": {
            "name": "Sugarcane",
            "total_days": 300,
            "stages": [
                {
                    "name": "Germination & Establishment",
                    "duration": 30,
                    "description": "Bud sprouting and shoot emergence",
                    "irrigation_frequency": "Light irrigation every 3-5 days until establishment",
                    "activities": [
                        "Plant 2-3 budded setts in furrows",
                        "Apply mulch to conserve moisture",
                        "Monitor for uniform sprouting"
                    ],
                    "fertilizers": ["Apply basal fertilizer in furrows before planting"],
                    "weather": "Warm, moist conditions promote sprouting",
                    "risks": ["Poor germination", "Sett rot", "Termite damage"]
                },
                {
                    "name": "Tillering",
                    "duration": 60,
                    "description": "Production of multiple shoots from each sett",
                    "irrigation_frequency": "Irrigate every 7-10 days",
                    "activities": [
                        "First weeding and earthing up at 30-40 days",
                        "Remove excess tillers if overcrowded",
                        "Monitor for early shoot borer"
                    ],
                    "fertilizers": ["Apply first dose of nitrogen (30% of total) at 30-40 days"],
                    "weather": "Adequate moisture and warm temperature promote tillering",
                    "risks": ["Early shoot borer", "Weed competition", "Root borer"]
                },
                {
                    "name": "Grand Growth Phase",
                    "duration": 120,
                    "description": "Rapid vertical growth and biomass accumulation",
                    "irrigation_frequency": "Regular irrigation every 10-15 days",
                    "activities": [
                        "Second dose of fertilizer application",
                        "Weeding and inter-cultivation",
                        "Monitor for stem borer and top borer",
                        "De-trashing (removal of dry leaves) if needed"
                    ],
                    "fertilizers": [
                        "Apply second nitrogen dose (40% of total) at 90-120 days",
                        "Apply final nitrogen dose (30% of total) at 150-180 days"
                    ],
                    "weather": "High temperature and long days promote rapid growth",
                    "risks": ["Stem borer", "Top borer", "Red rot disease", "Smut"]
                },
                {
                    "name": "Maturation",
                    "duration": 60,
                    "description": "Sugar accumulation in stems",
                    "irrigation_frequency": "Reduce irrigation frequency, stop 2-3 weeks before harvest",
                    "activities": [
                        "Monitor sugar content (brix levels)",
                        "Plan harvest schedule",
                        "Remove flowering tops if present"
                    ],
                    "fertilizers": ["No fertilizer application during maturation"],
                    "weather": "Dry weather and cool nights enhance sugar accumulation",
                    "risks": ["Flowering (reduces sugar content)", "Lodging", "Pests damaging mature cane"]
                },
                {
                    "name": "Harvest",
                    "duration": 30,
                    "description": "Cutting and transportation to mill",
                    "irrigation_frequency": "No irrigation",
                    "activities": [
                        "Cut cane close to ground level",
                        "Remove tops and trash",
                        "Transport to mill within 24-48 hours"
                    ],
                    "fertilizers": ["No fertilizer application"],
                    "weather": "Dry weather preferred for harvest operations",
                    "risks": ["Delay in crushing (sugar loss)", "Post-harvest deterioration", "Stubble damage"]
                }
            ]
        }
    }

    @staticmethod
    async def get_weather_forecast(latitude: float, longitude: float, days_ahead: int = 16) -> dict:
        """Fetch weather forecast from Open-Meteo API (free, no API key required)"""
        try:
            url = "https://api.open-meteo.com/v1/forecast"
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max",
                "forecast_days": days_ahead,
                "timezone": "auto"
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                return response.json()
        except Exception:
            return None

    @classmethod
    async def generate_lifecycle(cls, request: CropLifecycleRequest) -> CropLifecycleResponse:
        """Generate complete crop lifecycle calendar"""
        crop_data = cls.CROP_DATA.get(request.crop_type)
        if not crop_data:
            raise ValueError(f"Unsupported crop type: {request.crop_type}")
        
        total_days = crop_data["total_days"]
        harvest_date = request.planting_date + timedelta(days=total_days)
        today = date.today()
        current_day = (today - request.planting_date).days
        
        stages = []
        current_date = request.planting_date
        current_stage_name = "Not yet planted"
        
        for stage_data in crop_data["stages"]:
            start_date = current_date
            end_date = current_date + timedelta(days=stage_data["duration"] - 1)
            
            if current_day >= 0 and start_date <= today <= end_date:
                current_stage_name = stage_data["name"]
            
            stage = CropStage(
                stage_name=stage_data["name"],
                start_date=start_date,
                end_date=end_date,
                duration_days=stage_data["duration"],
                description=stage_data["description"],
                care_activities=stage_data["activities"],
                irrigation_frequency=stage_data["irrigation_frequency"],
                fertilizer_recommendations=stage_data["fertilizers"],
                weather_considerations=stage_data["weather"],
                risk_factors=stage_data["risks"]
            )
            stages.append(stage)
            current_date = end_date + timedelta(days=1)
        
        weather_forecast = await cls.get_weather_forecast(request.latitude, request.longitude)
        weather_alerts = cls._generate_weather_alerts(weather_forecast, request.planting_date, stages)
        
        irrigation_schedule = await cls._generate_irrigation_schedule_with_weather(
            stages, request.planting_date, request.latitude, request.longitude
        )
        fertilizer_schedule = cls._generate_fertilizer_schedule(stages, request.planting_date)
        
        general_tips = cls._get_general_care_tips(request.crop_type)
        harvest_indicators = cls._get_harvest_readiness_indicators(request.crop_type)
        
        return CropLifecycleResponse(
            crop_type=request.crop_type,
            crop_name=crop_data["name"],
            planting_date=request.planting_date,
            harvest_date=harvest_date,
            total_duration_days=total_days,
            current_stage=current_stage_name,
            current_day=max(0, current_day),
            location=request.location_name,
            stages=stages,
            weather_alerts=weather_alerts,
            irrigation_schedule=irrigation_schedule,
            fertilizer_schedule=fertilizer_schedule,
            general_care_tips=general_tips,
            harvest_readiness_indicators=harvest_indicators
        )

    @staticmethod
    def _generate_weather_alerts(weather_data: dict, planting_date: date, stages: List[CropStage]) -> List[WeatherAlert]:
        """Generate weather-based alerts for critical crop stages"""
        alerts = []
        
        if not weather_data or "daily" not in weather_data:
            return alerts
        
        daily = weather_data["daily"]
        time_entries = daily.get("time", [])
        
        for i, date_str in enumerate(time_entries):
            forecast_date = date.fromisoformat(date_str)
            
            precip_list = daily.get("precipitation_sum", [])
            precip = precip_list[i] if i < len(precip_list) and precip_list[i] is not None else 0
            
            precip_prob_list = daily.get("precipitation_probability_max", [])
            precip_prob = precip_prob_list[i] if i < len(precip_prob_list) and precip_prob_list[i] is not None else 0
            
            temp_max_list = daily.get("temperature_2m_max", [])
            temp_max = temp_max_list[i] if i < len(temp_max_list) and temp_max_list[i] is not None else None
            
            windspeed_list = daily.get("windspeed_10m_max", [])
            windspeed = windspeed_list[i] if i < len(windspeed_list) and windspeed_list[i] is not None else 0
            
            current_stage = None
            for stage in stages:
                if stage.start_date <= forecast_date <= stage.end_date:
                    current_stage = stage
                    break
            
            if temp_max and temp_max > 35 and current_stage:
                alerts.append(WeatherAlert(
                    date=forecast_date,
                    alert_type="Heat Stress",
                    severity="High",
                    description=f"High temperature of {temp_max:.1f}°C forecasted during {current_stage.stage_name}",
                    recommendations=[
                        "Increase irrigation frequency",
                        "Consider providing shade if possible",
                        "Monitor plants closely for stress symptoms"
                    ]
                ))
            
            if precip > 50 and current_stage:
                alerts.append(WeatherAlert(
                    date=forecast_date,
                    alert_type="Heavy Rainfall",
                    severity="Medium",
                    description=f"Heavy rainfall ({precip:.1f}mm) expected during {current_stage.stage_name}",
                    recommendations=[
                        "Ensure proper drainage",
                        "Avoid fertilizer application before rain",
                        "Watch for waterlogging and disease"
                    ]
                ))
            
            if windspeed > 40 and current_stage:
                alerts.append(WeatherAlert(
                    date=forecast_date,
                    alert_type="Strong Winds",
                    severity="Medium",
                    description=f"Strong winds ({windspeed:.1f} km/h) forecasted",
                    recommendations=[
                        "Provide support to tall plants if needed",
                        "Check for lodging after wind event",
                        "Delay spraying operations"
                    ]
                ))
        
        return alerts[:5]

    @staticmethod
    async def _generate_irrigation_schedule_with_weather(
        stages: List[CropStage], 
        planting_date: date,
        latitude: float,
        longitude: float
    ) -> List[dict]:
        """Generate irrigation schedule with weather-based recommendations"""
        schedule = []
        today = date.today()
        
        weather_data = await CropLifecycleService.get_weather_forecast(latitude, longitude)
        if not weather_data:
            return CropLifecycleService._generate_irrigation_schedule(stages, planting_date)
        
        daily_forecasts = weather_data.get("daily", {})
        forecast_dates = daily_forecasts.get("time", [])
        forecast_precip = daily_forecasts.get("precipitation_sum", [])
        
        weather_by_date = {}
        for i, date_str in enumerate(forecast_dates):
            precip_value = forecast_precip[i] if i < len(forecast_precip) and forecast_precip[i] is not None else 0
            weather_by_date[date_str] = {
                "precipitation": precip_value
            }
        
        for stage in stages:
            if stage.end_date >= today:
                upcoming_rain = 0
                rain_days = []
                
                for days_ahead in range(0, 3):
                    check_date = today + timedelta(days=days_ahead)
                    date_str = check_date.isoformat()
                    if date_str in weather_by_date:
                        precip = weather_by_date[date_str]["precipitation"]
                        if precip > 5:
                            upcoming_rain += precip
                            rain_days.append(f"{check_date.strftime('%b %d')} ({precip:.1f}mm)")
                
                recommendation = stage.irrigation_frequency
                if upcoming_rain > 10:
                    recommendation = f"⚠️ Skip irrigation - Rain forecasted: {', '.join(rain_days)}. Resume when soil dries."
                elif upcoming_rain > 5:
                    recommendation = f"⏸️ Delay irrigation - Light rain expected: {', '.join(rain_days)}. Monitor soil moisture."
                
                schedule.append({
                    "stage": stage.stage_name,
                    "period": f"{stage.start_date.strftime('%b %d')} - {stage.end_date.strftime('%b %d')}",
                    "frequency": stage.irrigation_frequency,
                    "recommendation": recommendation,
                    "is_critical": "critical" in stage.irrigation_frequency.lower() or "most critical" in stage.irrigation_frequency.lower()
                })
        
        return schedule

    @staticmethod
    def _generate_irrigation_schedule(stages: List[CropStage], planting_date: date) -> List[dict]:
        """Generate basic irrigation schedule (fallback without weather)"""
        schedule = []
        today = date.today()
        
        for stage in stages:
            if stage.end_date >= today:
                schedule.append({
                    "stage": stage.stage_name,
                    "period": f"{stage.start_date.strftime('%b %d')} - {stage.end_date.strftime('%b %d')}",
                    "frequency": stage.irrigation_frequency,
                    "recommendation": stage.irrigation_frequency,
                    "is_critical": "critical" in stage.irrigation_frequency.lower() or "most critical" in stage.irrigation_frequency.lower()
                })
        
        return schedule

    @staticmethod
    def _generate_fertilizer_schedule(stages: List[CropStage], planting_date: date) -> List[dict]:
        """Generate fertilizer application schedule"""
        schedule = []
        
        for stage in stages:
            if stage.fertilizer_recommendations and stage.fertilizer_recommendations[0].lower() != "no fertilizer application":
                for fertilizer in stage.fertilizer_recommendations:
                    schedule.append({
                        "date": stage.start_date,
                        "stage": stage.stage_name,
                        "fertilizer": fertilizer,
                        "timing": f"Day {(stage.start_date - planting_date).days}"
                    })
        
        return schedule

    @staticmethod
    def _get_general_care_tips(crop_type: str) -> List[str]:
        """Get general care tips for the crop"""
        tips = {
            "wheat": [
                "Monitor regularly for disease and pest symptoms",
                "Maintain proper drainage to avoid waterlogging",
                "Scout fields at least twice a week during critical stages",
                "Keep records of all inputs and observations for future planning"
            ],
            "rice": [
                "Maintain proper water depth throughout growth stages",
                "Regular field inspection for pest and disease management",
                "Remove weeds promptly to reduce competition",
                "Monitor water quality in flooded conditions"
            ],
            "maize": [
                "Practice crop rotation to reduce pest and disease pressure",
                "Monitor closely for fall armyworm, especially in early stages",
                "Ensure good drainage to prevent root diseases",
                "Scout fields regularly for nutrient deficiencies"
            ],
            "cotton": [
                "Integrated pest management is essential for cotton",
                "Regular scouting for bollworms and sucking pests",
                "Maintain field sanitation to reduce pest carryover",
                "Monitor plant health and address stress promptly"
            ],
            "soybean": [
                "Ensure good rhizobium nodulation for nitrogen fixation",
                "Scout regularly for pod-boring insects",
                "Maintain weed-free fields for maximum yield",
                "Harvest at proper moisture to reduce shattering"
            ],
            "sugarcane": [
                "Regular de-trashing improves air circulation and reduces pests",
                "Monitor for borers throughout the season",
                "Proper drainage is essential to prevent waterlogging",
                "Timely harvest and crushing maximize sugar recovery"
            ]
        }
        return tips.get(crop_type, [])

    @staticmethod
    def _get_harvest_readiness_indicators(crop_type: str) -> List[str]:
        """Get harvest readiness indicators for the crop"""
        indicators = {
            "wheat": [
                "80-85% of grains are golden brown in color",
                "Grain moisture content is 20-25%",
                "Grains are hard and difficult to crush with fingernail",
                "Lower leaves have dried completely"
            ],
            "rice": [
                "80-85% of grains are golden yellow",
                "Grains are hard when pressed between fingers",
                "Lower leaves have dried and turned brown",
                "Grain moisture is around 20-25%"
            ],
            "maize": [
                "Husks are dry and brown",
                "Kernels are hard and dent when pressed",
                "Black layer has formed at base of kernel",
                "Grain moisture is 20-25%"
            ],
            "cotton": [
                "60-70% of bolls have opened fully",
                "Fiber is white and fluffy",
                "Bolls separate easily from plant",
                "Weather conditions are dry"
            ],
            "soybean": [
                "95% of pods are brown or tan in color",
                "Seeds rattle in pods when shaken",
                "Grain moisture is 13-15%",
                "Leaves have dropped from most plants"
            ],
            "sugarcane": [
                "Cane is 10-12 months old (seasonal crop)",
                "Brix reading is 18% or higher",
                "Internodes are mature and hard",
                "Lower leaves have dried"
            ]
        }
        return indicators.get(crop_type, [])
