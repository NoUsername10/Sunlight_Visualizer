"""Tests for station GHI processing and source-independent shading demand."""

from datetime import datetime, timedelta, timezone
import unittest

from custom_components.sunlight_visualizer.local_radiation import (
    GHIHistory,
    estimate_components,
    shading_demand,
)


class LocalRadiationTests(unittest.TestCase):
    """Check the calculations that feed wall and roof sensors."""

    def test_shading_demand_uses_wall_exposure_and_caps_at_100(self) -> None:
        self.assertAlmostEqual(shading_demand(141, 0.81, 34.4), 28.5525)
        self.assertAlmostEqual(shading_demand(457, 0.811, 33.4), 92.65675)
        self.assertEqual(shading_demand(500, 0.8, 30), 100)
        self.assertEqual(shading_demand(800, 0.8, 30), 100)
        self.assertEqual(shading_demand(800, 0, 30), 0)
        self.assertEqual(shading_demand(800, 0.8, -1), 0)

    def test_rolling_average_and_stale_report(self) -> None:
        now = datetime(2026, 11, 5, 12, 0, tzinfo=timezone.utc)
        history = GHIHistory()
        history.add(now - timedelta(minutes=10), 100)
        history.add(now - timedelta(minutes=5), 300)
        self.assertEqual(history.average(now, 10, 15), 200)
        self.assertIsNone(history.average(now + timedelta(minutes=11), 10, 15))
        history.clear()
        history.add(now + timedelta(minutes=11), 500)
        self.assertEqual(history.average(now + timedelta(minutes=11), 10, 15), 500)

    def test_erbs_components_conserve_horizontal_ghi(self) -> None:
        when = datetime(2026, 11, 3, 11, 56, tzinfo=timezone.utc)
        values = estimate_components(141, 34.43, when)
        self.assertAlmostEqual(
            values["direct_radiation"] + values["diffuse_radiation"], 141
        )
        self.assertGreaterEqual(values["direct_normal_irradiance"], 0)
        self.assertEqual(
            estimate_components(141, -1, when)["direct_normal_irradiance"], 0
        )


if __name__ == "__main__":
    unittest.main()
