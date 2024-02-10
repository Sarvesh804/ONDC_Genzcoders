#include <iostream>
#include <unordered_map>
#include <set>
#include <vector>
#include <string>
#include <fstream>
#include <chrono>
#include <sstream> // for stringstream

class SparseMatrix
{
private:
    std::unordered_map<int, std::set<std::string>> pincode_merchant_map;
    std::unordered_map<int, std::set<std::string>> cache;

    // File paths for persistence
    const std::string pincodeFilePath = "pincode_data.txt";

    // Load pincode-merchant mappings from file
    void loadFromFile()
    {
        std::ifstream infile(pincodeFilePath);
        int pincode;
        std::string merchantId;

        while (infile >> pincode >> merchantId)
        {
            pincode_merchant_map[pincode].insert(merchantId);
        }
        infile.close();
    }

    // Save pincode-merchant mappings to file
    void saveToFile()
    {
        std::ofstream outfile(pincodeFilePath);
        for (const auto &entry : pincode_merchant_map)
        {
            int pincode = entry.first;
            for (const auto &merchantId : entry.second)
            {
                outfile << pincode << " " << merchantId << "\n";
            }
        }
        outfile.close();
    }

public:
    SparseMatrix()
    {
        // Load data from file on object creation
        loadFromFile();
    }

    void addServiceability(const std::string &merchantId, const std::vector<int> &pincodes)
    {
        for (int pincode : pincodes)
        {
            pincode_merchant_map[pincode].insert(merchantId);
            // Invalidate cache for the modified pincode
            cache.erase(pincode);
        }
        // Save data to file after modification
        saveToFile();
    }

    std::set<std::string> checkServiceability(int pincode)
    {
        auto iter = pincode_merchant_map.find(pincode);
        if (iter != pincode_merchant_map.end())
        {
            return iter->second;
        }
        return {};
    }
};

int main(int argc, char *argv[])
{
    // Check if pincode is provided as a command-line argument
    if (argc != 2)
    {
        std::cerr << "Usage: " << argv[0] << " <pincode>" << std::endl;
        return 1;
    }

    // Parse pincode from command-line argument
    std::stringstream ss(argv[1]);
    int pincode;
    if (!(ss >> pincode))
    {
        std::cerr << "Invalid pincode" << std::endl;
        return 1;
    }

    SparseMatrix sparseMatrix;
    auto serviceableMerchants = sparseMatrix.checkServiceability(pincode);

    // Output result in JSON format
    std::cout << "{\"merchants\": [";
    bool first = true;
    for (const auto &merchant : serviceableMerchants)
    {
        if (!first)
            std::cout << ",";
        std::cout << "\"" << merchant << "\"";
        first = false;
    }
    std::cout << "]}" << std::endl;

    return 0;
}
