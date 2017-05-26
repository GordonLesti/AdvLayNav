<?php
/**
 * Copyright © PART <info@part-online.de>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
 namespace Part\AdvLayNav\Helper;

 use Magento\Catalog\Model\ResourceModel\Eav\Attribute;
 use Part\AdvLayNav\Model\AdvLayNav;

/**
 * Class Data
 */
class Data extends \Magento\Framework\App\Helper\AbstractHelper
{
    /**
     * The key that stores the AdvLayNav type in the attribute.
     *
     * @var string
     */
    private $inputKey = AdvLayNav::INPUT_TYPE_KEY;

    /**
     * Checks if the given attribute is a range slider.
     *
     * @param Attribute $attribute
     * @return bool
     */
    public function isAdvLayNavRangeSliderAttribute(Attribute $attribute)
    {
        $this->extractAdditionalDataEavAttribute($attribute);

        return $attribute->getData($this->inputKey) === AdvLayNav::INPUT_TYPE_RANGE_SLIDER;
    }

    /**
     * Checks if the given attribute is a multi select.
     *
     * @param Attribute $attribute
     * @return bool
     */
    public function isAdvLayNavMultiSelectAttribute(Attribute $attribute)
    {
        $this->extractAdditionalDataEavAttribute($attribute);

        return $attribute->getData($this->inputKey) === AdvLayNav::INPUT_TYPE_MULTI_SELECT;
    }

    /**
     * Takes the AdvLayNav data if they exist from the attribute and stores them in additional data of the attribute.
     *
     * @param Attribute $attribute
     * @return $this
     */
    public function assembleAdditionalDataEavAttribute(Attribute $attribute)
    {
        $iniAdditionalData = [];
        $additionalData = (string) $attribute->getData('additional_data');
        if (!empty($additionalData)) {
            $additionalData = unserialize($additionalData);
            if (is_array($additionalData)) {
                $iniAdditionalData = $additionalData;
            }
        }

        $dataValue = $attribute->getData($this->inputKey);
        if (!is_null($dataValue)) {
            $iniAdditionalData[$this->inputKey] = $dataValue;
            $attribute->setData('additional_data', serialize($iniAdditionalData));
            if ($dataValue === AdvLayNav::INPUT_TYPE_RANGE_SLIDER ||
                $dataValue === AdvLayNav::INPUT_TYPE_MULTI_SELECT) {
                $attribute->setData('is_filterable', true);
            }
        }

        return $this;
    }

    public function isFilterApplied(\Magento\Catalog\Model\Layer\State $state, $attributeCode)
    {
        $appliedFilters = $state->getFilters();
        foreach ($appliedFilters as $appliedFilter) {
            $appliedAttributeCode = $appliedFilter->getFilter()->getRequestVar();
            if ($appliedAttributeCode === $attributeCode) {
                return true;
            }
        }
        return false;
    }

    /**
     * Takes the AdvLayNav data from the additional data of the attribute if they exist and stores them in the data of
     * the attribute.
     *
     * @param Attribute $attribute
     * @return void
     */
    private function extractAdditionalDataEavAttribute(Attribute $attribute)
    {
        if (!$attribute->hasData($this->inputKey)) {
            $additionalData = unserialize($attribute->getData('additional_data'));
            if (isset($additionalData[$this->inputKey])) {
                $attribute->setData($this->inputKey, $additionalData[$this->inputKey]);
            }
        }
    }
}
