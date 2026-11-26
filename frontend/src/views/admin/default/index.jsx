
import React, { useCallback, useEffect, useState } from "react";

import {
  Badge,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { MdDelete } from "react-icons/md";
import MiniStatistics from "components/card/MiniStatistics";

const API = "http://127.0.0.1:5000";

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [deviceStats, setDeviceStats] = useState({});
  const [results, setResults] = useState({});
  const [history, setHistory] = useState({});
  const [showHistory, setShowHistory] = useState({});

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [deviceType, setDeviceType] = useState("Computer");

  const [checking, setChecking] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Theme colors
  const cardBg = useColorModeValue("white", "navy.800");
  const textColor = useColorModeValue("gray.700", "white");
  const formBg = useColorModeValue("gray.50", "navy.700");
  const errorBg = useColorModeValue("red.50", "red.900");
const errorColor = useColorModeValue("red.600", "red.100");

  // Button colors
  const checkButtonBg = useColorModeValue("brand.500", "purple.500");
  const checkButtonHover = useColorModeValue("brand.600", "purple.400");

  const historyButtonColor = useColorModeValue(
    "purple.500",
    "purple.200"
  );

  const historyButtonBorder = useColorModeValue(
    "purple.200",
    "purple.400"
  );

  const historyHoverBg = useColorModeValue(
    "purple.50",
    "whiteAlpha.100"
  );

  const deleteButtonColor = useColorModeValue(
    "red.500",
    "red.300"
  );

  const deleteHoverBg = useColorModeValue(
    "red.50",
    "whiteAlpha.100"
  );

  const loadDeviceStats = async (deviceList) => {
    try {
      const stats = {};

      for (const device of deviceList) {
        const response = await fetch(
          `${API}/api/devices/${device.id}/stats`
        );

        if (response.ok) {
          stats[device.id] = await response.json();
        }
      }

      setDeviceStats(stats);
    } catch (error) {
      console.error("Error loading device statistics:", error);
    }
  };

  // Load devices and their latest monitoring results
  const loadDevices = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/devices`);

      if (!response.ok) {
        throw new Error("Could not load devices.");
      }

      const data = await response.json();
      setDevices(data);
      loadDeviceStats(data);

      const latestResults = {};

      await Promise.all(
        data.map(async (device) => {
          try {
            const historyResponse = await fetch(
              `${API}/api/devices/${device.id}/history`
            );

            if (!historyResponse.ok) return;

            const historyData = await historyResponse.json();

            if (historyData.length > 0) {
              latestResults[device.id] = historyData[0];

              if (showHistory[device.id]) {
                setHistory((previous) => ({
                  ...previous,
                  [device.id]: historyData,
                }));
              }
            }
          } catch (error) {
            console.error("History error:", error);
          }
        })
      );
      setResults(latestResults);
      setError("");
    } catch (error) {
      console.error("Device loading error:", error);
      setError("Could not connect to the Netwatch server.");
    } finally {
      setLoading(false);
    }
  }, [showHistory]);

  // Automatically refresh every 30 seconds
  useEffect(() => {
    loadDevices();

    const interval = setInterval(() => {
      loadDevices();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadDevices]);

  // Add a device
  const addDevice = async () => {
    if (!name || !ipAddress) {
      setError("Please enter a device name and IP address.");
      return;
    }

    try {
      const response = await fetch(`${API}/devices/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          name: name,
          ip_address: ipAddress,
          device_type: deviceType,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not add device.");
      }

      setName("");
      setIpAddress("");
      setDeviceType("Computer");
      setShowForm(false);
      setError("");

      await loadDevices();
    } catch (error) {
      setError("Could not add device.");
    }
  };

  // Delete a device
  const deleteDevice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this device?")) {
      return;
    }

    try {
      const response = await fetch(`${API}/api/devices/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete device.");
      }

      setResults((previous) => {
        const updated = { ...previous };
        delete updated[id];
        return updated;
      });

      setHistory((previous) => {
        const updated = { ...previous };
        delete updated[id];
        return updated;
      });

      setShowHistory((previous) => {
        const updated = { ...previous };
        delete updated[id];
        return updated;
      });

      await loadDevices();
    } catch (error) {
      setError("Could not delete device.");
    }
  };

  // Manually check a device
  const checkDevice = async (id) => {
    setChecking((previous) => ({
      ...previous,
      [id]: true,
    }));

    try {
      const response = await fetch(`${API}/api/devices/${id}/check`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Check failed.");
      }

      const data = await response.json();

      setResults((previous) => ({
        ...previous,
        [id]: data,
      }));

      await loadHistory(id);
    } catch (error) {
      setError("Could not check this device.");
    } finally {
      setChecking((previous) => ({
        ...previous,
        [id]: false,
      }));
    }
  };

  // Load monitoring history
  const loadHistory = async (id) => {
    try {
      const response = await fetch(`${API}/api/devices/${id}/history`);

      if (!response.ok) {
        throw new Error("Could not load history.");
      }

      const data = await response.json();

      setHistory((previous) => ({
        ...previous,
        [id]: data,
      }));
    } catch (error) {
      console.error("History error:", error);
    }
  };

  // Show or hide history
  const toggleHistory = async (id) => {
    const isVisible = showHistory[id];

    setShowHistory((previous) => ({
      ...previous,
      [id]: !isVisible,
    }));

    if (!isVisible) {
      await loadHistory(id);
    }
  };

  // Dashboard statistics
  const total = devices.length;

  const online = devices.filter(
    (device) => results[device.id]?.status === "Online"
  ).length;

  const offline = devices.filter(
    (device) => results[device.id]?.status === "Offline"
  ).length;

  const latencyValues = devices
    .map((device) => results[device.id]?.latency)
    .filter(
      (latency) => latency !== null && latency !== undefined
    );

  const averageLatency =
    latencyValues.length > 0
      ? (
          latencyValues.reduce(
            (total, latency) => total + Number(latency),
            0
          ) / latencyValues.length
        ).toFixed(2)
      : "0";

  return (
    <Box pt={{ base: "120px", md: "80px" }}>
      {/* Page heading */}
      <Flex
        justify="space-between"
        align="center"
        mb="25px"
        wrap="wrap"
        gap="15px"
      >
        <Box>
          <Heading size="lg" color={textColor}>
            Network Overview
          </Heading>

          <Text color="gray.500" mt="5px">
            Monitor and manage your network devices.
          </Text>
        </Box>

        <Flex gap="10px">
          <Button
            colorScheme="gray"
            variant="outline"
            borderRadius="12px"
            onClick={loadDevices}
          >
            Refresh
          </Button>

          <Button
            colorScheme="brand"
            borderRadius="12px"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ Add Device"}
          </Button>
        </Flex>
      </Flex>

      {/* Error message */}
{error && (
  <Box
    bg={errorBg}
    color={errorColor}
    p="12px"
    borderRadius="10px"
    mb="20px"
  >
    {error}
  </Box>
)}

      {/* Statistics */}
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        gap="20px"
        mb="25px"
      >
        <MiniStatistics name="Total Devices" value={total} />
        <MiniStatistics name="Online Devices" value={online} />
        <MiniStatistics name="Offline Devices" value={offline} />
        <MiniStatistics
          name="Average Latency"
          value={`${averageLatency} ms`}
        />
      </SimpleGrid>

      {/* Add device form */}
      {showForm && (
        <Box
          bg={cardBg}
          p="25px"
          borderRadius="20px"
          mb="25px"
          boxShadow="sm"
        >
          <Heading size="md" mb="20px" color={textColor}>
            Add New Device
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} gap="15px">
            <FormControl>
              <FormLabel>Device Name</FormLabel>
              <Input
                placeholder="e.g. My Computer"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>IP Address</FormLabel>
              <Input
                placeholder="e.g. 192.168.1.1"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Device Type</FormLabel>
              <Select
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
              >
                <option value="Computer">Computer</option>
                <option value="Router">Router</option>
                <option value="Switch">Switch</option>
                <option value="Server">Server</option>
                <option value="Printer">Printer</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>
          </SimpleGrid>

          <Button
            mt="20px"
            colorScheme="brand"
            borderRadius="12px"
            onClick={addDevice}
          >
            Save Device
          </Button>
        </Box>
      )}

      {/* Devices section */}
      <Box
        bg={cardBg}
        p="25px"
        borderRadius="20px"
        boxShadow="sm"
      >
        <Flex justify="space-between" align="center" mb="20px">
          <Box>
            <Heading size="md" color={textColor}>
              Network Devices
            </Heading>

            <Text color="gray.500" fontSize="sm" mt="5px">
              Your registered network devices
            </Text>
          </Box>

          <Badge
            colorScheme="purple"
            px="10px"
            py="5px"
            borderRadius="8px"
          >
            {total} Devices
          </Badge>
        </Flex>

        {loading ? (
          <Text color="gray.500">Loading devices...</Text>
        ) : devices.length === 0 ? (
          <Text color="gray.500">
            No devices added yet. Click Add Device to get started.
          </Text>
        ) : (
          <Box overflowX="auto">
            <Box minW="950px">
              {/* Table header */}
              <SimpleGrid
                columns={7}
                spacing="15px"
                p="12px"
                bg={formBg}
                borderRadius="10px"
                mb="10px"
              >
                <Text fontWeight="600" fontSize="sm">Name</Text>
                <Text fontWeight="600" fontSize="sm">IP Address</Text>
                <Text fontWeight="600" fontSize="sm">Type</Text>
                <Text fontWeight="600" fontSize="sm">Status</Text>
                <Text fontWeight="600" fontSize="sm">Uptime</Text>
                <Text fontWeight="600" fontSize="sm">Total Checks</Text>
                <Text fontWeight="600" fontSize="sm">Actions</Text>
              </SimpleGrid>

              {devices.map((device) => {
  const result = results[device.id];
  const stats = deviceStats[device.id];

  return (
    <Box key={device.id} mb="15px">
      <SimpleGrid
        columns={7}
        spacing="15px"
        alignItems="center"
        p="12px"
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        {/* Device name */}
        <Text fontWeight="600" color={textColor}>
          {device.name}
        </Text>

        {/* IP address */}
        <Text color="gray.500" fontSize="sm">
          {device.ip_address}
        </Text>

        {/* Device type */}
        <Text color="gray.500" fontSize="sm">
          {device.device_type}
        </Text>

        {/* Status */}
        <Box>
          <Badge
            colorScheme={
              result?.status === "Online"
                ? "green"
                : result?.status === "Offline"
                ? "red"
                : "gray"
            }
            borderRadius="8px"
            px="8px"
            py="5px"
          >
            {result?.status || "Unknown"}
          </Badge>
        </Box>

        {/* Uptime */}
        <Text color={textColor} fontSize="sm" fontWeight="600">
          {stats?.uptime ?? 0}%
        </Text>

        {/* Total checks */}
        <Text color="gray.500" fontSize="sm">
          {stats?.total_checks ?? 0}
        </Text>

        {/* Actions */}
        <Flex gap="6px" align="center" wrap="nowrap">
          <Button
            size="sm"
            bg={checkButtonBg}
            color="white"
            _hover={{ bg: checkButtonHover }}
            borderRadius="10px"
            px="10px"
            fontWeight="500"
            isLoading={checking[device.id]}
            onClick={() => checkDevice(device.id)}
          >
            Check
          </Button>

          <Button
            size="sm"
            variant="outline"
            color={historyButtonColor}
            borderColor={historyButtonBorder}
            _hover={{ bg: historyHoverBg }}
            borderRadius="10px"
            px="10px"
            fontWeight="500"
            onClick={() => toggleHistory(device.id)}
          >
            History
          </Button>

          <IconButton
            size="sm"
            variant="ghost"
            color={deleteButtonColor}
            _hover={{ bg: deleteHoverBg }}
            borderRadius="10px"
            aria-label="Delete device"
            icon={<MdDelete size={18} />}
            onClick={() => deleteDevice(device.id)}
          />
        </Flex>
      </SimpleGrid>

      {/* Monitoring history */}
      {showHistory[device.id] && (
        <Box mt="10px" p="15px" bg={cardBg} borderRadius="12px">
          <Heading size="sm" mb="10px">
            Monitoring History
          </Heading>

          {(history[device.id] || []).map((item) => (
            <Flex
              key={item.id}
              justify="space-between"
              py="6px"
              borderBottom="1px solid"
              borderColor="gray.100"
            >
              <Badge
                colorScheme={item.status === "Online" ? "green" : "red"}
              >
                {item.status}
              </Badge>

              <Text fontSize="sm" color="gray.500">
                {item.latency !== null ? `${item.latency} ms` : "N/A"}
              </Text>

              <Text fontSize="sm" color="gray.500">
                {item.checked_at}
              </Text>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
})}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
